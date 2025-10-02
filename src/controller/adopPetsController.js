import AdopPets from "../model/AdopPets.js";
import fs from "fs";
import path from "path";
import sendMailer from "../utils/sendMailer.js";
export const adop_pet_create = async (req, res) => {
  try {
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
      adoption_fee,
    } = req.body;

    // File paths

    const photo = req.files["photos"]?.map((file) => file.filename) || [];
    const video = req.files["video"]?.[0]?.filename || null;

    // Save to DB
    const pet = await AdopPets.create({
      name,
      age,
      breed,
      size: size.toLowerCase(), // schema expects "small|medium|large"
      gender: gender.toLowerCase(), // schema expects "male|female"
      color,
      location,
      medical_history,
      description,
      adoption_fee,
      photo,
      video,
      post_user: req.user.id,
    });

    const subject = "Pet Created Successfully";
    const html = `
      <h2>Hi ${req.user.name},</h2>
      <p>Your pet <b>${name}</b> has been added to PetzAdop.</p>
      <p><b>Breed:</b> ${breed}</p>
      <p><b>Location:</b> ${location}</p>
      <p>Thank you for using PetzAdop 🐾</p>
    `;
    await sendMailer(req.user.email, subject, html);

    res.status(201).json({
      success: true,
      message: "Pet created successfully",
      pet,
    });
  } catch (error) {
    console.error("Pet Create Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const adop_pet_update = async (req, res) => {
  try {
    const petId = req.params.id;

    const pet = await AdopPets.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const updateData = { ...req.body };
    if (updateData.gender) {
      updateData.gender = updateData.gender.toLowerCase();
    }
    if (updateData.size) {
      updateData.size = updateData.size.toLowerCase();
    }
    // Handle new photos
    if (req.files && req.files["photos"]) {
      const newPhotos = req.files["photos"].map((file) => file.filename);
      updateData.photo = [...pet.photo, ...newPhotos];
    } else {
      updateData.photo = pet.photo; // keep old photos if none uploaded
    }

    // Handle video
    if (req.files && req.files["video"]) {
      updateData.video = req.files["video"][0].filename;
    } else {
      updateData.video = pet.video; // keep old video
    }

    const updatedPet = await AdopPets.findByIdAndUpdate(petId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Pet updated successfully",
      updatedPet,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/postpet?page=1&limit=5
export const adop_pet_list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;

    const pets = await AdopPets.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("post_user", "name email");

    const total = await AdopPets.countDocuments();

    res.status(200).json({
      status: "success",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      pets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/postpet/breeds
export const adop_pet_getBreeds = async (req, res) => {
  try {
    // Get unique breed values
    const breeds = await AdopPets.distinct("breed");

    res.status(200).json({
      status: "success",
      breeds,
    });
  } catch (err) {
    console.error("Get breeds error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// controllers/adopPetController.js
export const adop_pet_deletePet = async (req, res) => {
  try {
    const petId = req.params.id;

    const pet = await AdopPets.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Delete photos
    pet.photo.forEach((filename) => {
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Delete video
    if (pet.video) {
      const videoPath = path.join("uploads", pet.video);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    // Delete from DB
    await AdopPets.findByIdAndDelete(petId);

    res
      .status(200)
      .json({ status: "success", message: "Pet deleted successfully" });
  } catch (err) {
    console.error("Delete pet error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const adop_pet_deletePhoto = async (req, res) => {
  try {
    const petId = req.params.id;
    const { filename } = req.body;

    const pet = await AdopPets.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Remove photo from DB
    pet.photo = pet.photo.filter((img) => img !== filename);

    // Delete file from uploads folder
    const filePath = path.join("uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pet.save();

    res.status(200).json({ status: "success", message: "Photo deleted", pet });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/postpet/:id
export const adop_pet_get = async (req, res) => {
  try {
    const pet = await AdopPets.findById(req.params.id).populate(
      "post_user",
      "name email"
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.status(200).json({ status: "success", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// controllers/adopPetController.js
export const adop_pet_deleteVideo = async (req, res) => {
  try {
    const petId = req.params.id;
    const { filename } = req.body;

    const pet = await AdopPets.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Remove video from DB
    if (pet.video === filename) {
      pet.video = null;

      // Delete file from uploads folder
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await pet.save();
      return res
        .status(200)
        .json({ status: "success", message: "Video deleted", pet });
    } else {
      return res.status(400).json({ message: "Video not found on this pet" });
    }
  } catch (err) {
    console.error("Delete video error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/postpet/search
export const adop_pet_search = async (req, res) => {
  try {
    const {
      search,
      location,
      breed,
      size,
      minAge,
      maxAge,
      page = 1,
      limit = 6,
    } = req.query;

    const query = {};

    // Free-text search
    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
      ];
    }

    // Location
    if (location?.trim()) {
      query.location = { $regex: location, $options: "i" };
    }

    // Breed filter (only if passed)
    if (breed?.trim()) {
      query.breed = { $in: breed.split(",").filter(Boolean) };
    }
    if (size?.trim()) {
      query.size = { $in: size.split(",").filter(Boolean) };
    }

    // Age filter (since age is a Number in schema)
    const ageFilter = {};
    if (minAge) ageFilter.$gte = parseInt(minAge);
    if (maxAge) ageFilter.$lte = parseInt(maxAge);
    if (Object.keys(ageFilter).length > 0) {
      query.age = ageFilter;
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const skip = (pageNum - 1) * limitNum;

    const pets = await AdopPets.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate("post_user", "name email");

    const total = await AdopPets.countDocuments(query);

    res.json({
      status: "success",
      pets,
      total,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/postpet/request

export const adop_pet_request = async (req, res) => {
  try {
    const { petId } = req.body;

    if (!petId) return res.status(400).json({ message: "petId is required" });

    const pet = await AdopPets.findById(petId).populate(
      "post_user",
      "name email"
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Take email from logged-in user
    const adopterEmail = req.user.email; // <-- from token

    // Save request in DB
    pet.requests.push({ adopter_email: adopterEmail, status: "pending" });
    await pet.save();

    // Send email to shelter
    const shelterEmail = pet.post_user.email;
    const subject = `Adoption Request for ${pet.name}`;
    const html = `
      <p>Hello ${pet.post_user.name},</p>
      <p>You have a new adoption request for <b>${pet.name}</b>.</p>
      <p>Adopter's email: ${adopterEmail}</p>
      <p>Status: Pending</p>
      <p>Please contact the adopter to proceed.</p>
      <p>Regards, <br/>PetzAdop App</p>
    `;
    await sendMailer(shelterEmail, subject, html);

    res.status(200).json({
      status: "success",
      message: `Request sent and recorded. Shelter notified at ${shelterEmail}`,
      petId: pet._id,
    });
  } catch (err) {
    console.error("Error sending adoption request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/postpet/requests
export const adop_pet_getRequests = async (req, res) => {
  try {
    const shelterId = req.user.id;

    // Find all pets of this shelter
    const pets = await AdopPets.find({ post_user: shelterId }).select(
      "name requests"
    );

    res.status(200).json({ status: "success", pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/postpet/request/:petId/:requestId
export const adop_pet_updateRequestStatus = async (req, res) => {
  try {
    const { petId, requestId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const pet = await AdopPets.findById(petId).populate(
      "post_user",
      "name email"
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Find request
    const request = pet.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update status
    request.status = status;
    await pet.save();

    // Send email to adopter
    const subject = `Your adoption request for ${pet.name} is ${status}`;
    const html = `
      <p>Hello,</p>
      <p>Your adoption request for <b>${pet.name}</b> has been <b>${status}</b> by the shelter.</p>
      <p>Regards, <br/>PetzAdop App</p>
    `;
    await sendMailer(request.adopter_email, subject, html);

    // If approved, delete the pet post
    // if (status === "approved") {
    //   // Delete photos
    //   pet.photo.forEach((filename) => {
    //     const filePath = path.join("uploads", filename);
    //     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    //   });

    //   // Delete video
    //   if (pet.video) {
    //     const videoPath = path.join("uploads", pet.video);
    //     if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    //   }

    //   // Delete from DB
    //   // await AdopPets.findByIdAndDelete(petId);
    // }

    res.status(200).json({
      status: "success",
      message:
        status === "approved"
          ? "Request approved, pet deleted and adopter notified"
          : "Request rejected and adopter notified",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
