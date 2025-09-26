import AdopPets from "../model/AdopPets.js";
import fs from "fs";
import path from "path";
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
    console.log(req.file, "req.file");

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

export const adop_pet_list = async (req, res) => {
  try {
    const pets = await AdopPets.find().populate("post_user", "name email"); // populate post_user info
    //   .populate("reviews"); // optional: populate reviews if needed

    res.status(200).json({
      status: "success",
      total: pets.length,
      pets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const adop_pet_delete = async (req, res) => {
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
