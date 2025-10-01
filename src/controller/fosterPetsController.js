// controllers/fosterPetsController.js
import FosterPets from "../model/FosterPets.js";
import mongoose from "mongoose";

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
  requests: [
    {
      requester: user.id, // string or ObjectId, Mongoose will cast
      status: "pending",  // default
      requestedAt: new Date()
    }
  ],
});


    await newPet.save();

    res.status(201).json({
      message: "Foster pet posted successfully",
      pet: newPet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET: Get foster pets for a specific organization
export const getFosterPetsByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const pets = await FosterPets.find({ fosterOrgId: orgId }).populate(
      "submittedBy",
      "name email"
    );
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

    res.status(200).json({ message: `Request ${status}`, pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
