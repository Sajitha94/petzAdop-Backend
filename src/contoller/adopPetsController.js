import AdopPets from "../model/AdopPets.js";

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
    console.log(petId, "saji");

    const updateData = req.body;
    const updatedPet = await AdopPets.findByIdAndUpdate(petId, updateData, {
      new: true, // return the updated document
      runValidators: true, // validate before updating
    });
    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Pet updated successfully",
      updatedPet,
    });
  } catch (err) {
    console.error(err);
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

    const deletedPet = await AdopPets.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Pet deleted successfully",
      deletedPet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
