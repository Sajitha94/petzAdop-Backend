import User from "../model/User.js";
import AdopPets from "../model/AdopPets.js";

export const get_user_count = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const availablePets = await AdopPets.countDocuments({ petsStatus: 1 });
    const adoptedPets = await AdopPets.countDocuments({ petsStatus: -1 });

    res.status(200).json({
      success: true,
      users: totalUsers,
      pets: {
        available: availablePets,
        adopted: adoptedPets,
      },
    });
  } catch (error) {
    console.error("Get User Count Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
