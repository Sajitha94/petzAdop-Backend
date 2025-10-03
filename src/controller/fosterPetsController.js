// controllers/fosterPetsController.js
import FosterPets from "../model/FosterPets.js";
import mongoose from "mongoose";
import sendMailer from "../utils/sendMailer.js";

// POST: Create foster pet

export const createFosterPet = async (req, res) => {
  try {
    const user = req.user;

    const {
      name,
      age,
      breed,
      size,
      gender,
      color,
      location,
      medical_history,
      description,
      fosterOrgId,
      start_date,
      end_date,
    } = req.body;

    const photos = req.files?.photos?.map((f) => f.filename) || [];
    const video = req.files?.video ? req.files.video[0].filename : null;

    const newPet = new FosterPets({
      name,
      age,
      breed,
      size,
      gender,
      color,
      location,
      medical_history,
      description,
      photos,
      video,
      fosterOrgId,
      start_date,
      end_date,
      requests: [
        {
          forster_parent_ID: user.id,
          forster_parent_email: user.email,
          status: "pending",
          requestedAt: new Date(),
        },
      ],
    });

    await newPet.save();

    // Send email to the user who created the foster pet
    const html = `
      <h3>Hello ${user.name || "User"}!</h3>
      <p>Your foster pet <strong>${name}</strong> has been successfully created.</p>
      <p>Foster period: ${
        start_date ? new Date(start_date).toDateString() : "N/A"
      } 
      to ${end_date ? new Date(end_date).toDateString() : "N/A"}</p>
      <p>Thank you for using PetzAdop!</p>
    `;

    res.status(201).json({
      message: "Foster pet posted successfully and email sent",
      pet: newPet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  await sendMailer(user.email, "Foster Pet Created Successfully", html);
};

// GET: Get all foster pets
export const getAllFosterPets = async (req, res) => {
  try {
    const pets = await FosterPets.find()
      .populate("fosterOrgId", "name email") // if you want org details
      .populate("requests.forster_parent_ID", "name email"); // if you want user details for requests

    res.status(200).json({ status: "success", data: pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// GET: Get foster pets for a specific organization
export const getFosterPetsByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch pets by orgId
    const pets = await FosterPets.find({ fosterOrgId: orgId }).select(
      "name age breed gender location photos requests start_date end_date"
    );

    // The `requests` array includes `forster_parent_email`
    res.json({ status: "success", data: pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// POST: Add adoption request
export const requestAdoption = async (req, res) => {
  try {
    const user = req.user; // logged-in user making the request
    const { petId } = req.body;

    const pet = await FosterPets.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Check if the user already requested
    const alreadyRequested = pet.requests.some(
      (r) => r.requester.toString() === user.id
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "Already requested adoption" });
    }

    pet.requests.push({ requester: user.id });
    await pet.save();

    res.status(200).json({ message: "Adoption request sent", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST: Update adoption request status

export const updateRequestStatus = async (req, res) => {
  try {
    const { petId, requestId } = req.params;
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const pet = await FosterPets.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    const request = pet.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await pet.save();

    // Prepare email content
    const html = `
      <h3>Hello!</h3>
      <p>Your adoption request for pet <strong>${
        pet.name
      }</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
      ${
        status === "accepted"
          ? `<p>Foster period: ${pet.start_date?.toDateString()} to ${pet.end_date?.toDateString()}</p>`
          : ""
      }
      <p>Thank you for using PetzAdop!</p>
    `;
    res.status(200).json({ message: `Request ${status}`, pet });

    // Send email
    await sendMailer(
      request.forster_parent_email,
      `Adoption Request ${status}`,
      html
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
