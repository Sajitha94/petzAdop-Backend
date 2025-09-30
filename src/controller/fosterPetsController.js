// controllers/fosterPetsController.js
import FosterPets from "../model/FosterPets.js";

// POST: Create foster pet
export const createFosterPet = async (req, res) => {
  try {
    const user = req.user;
    console.log("USER FROM REQ:", user);

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
      submittedBy: user.id,
      fosterOrgId,
    });

    await newPet.save();
    res
      .status(201)
      .json({ message: "Foster pet posted successfully", pet: newPet });
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
