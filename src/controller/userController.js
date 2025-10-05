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

export const getUserRating = async (req, res) => {
  try {
    const { userId } = req.params;

    const pets = await AdopPets.find({ post_user: userId });

    let totalRating = 0;
    let totalReviews = 0;

    pets.forEach((pet) => {
      // If pet has a single review object
      if (pet.review && pet.review.rating) {
        totalRating += pet.review.rating;
        totalReviews += 1;
      }

      // If pet has a reviews array
      if (pet.reviews && pet.reviews.length > 0) {
        pet.reviews.forEach((r) => {
          totalRating += r.rating;
          totalReviews += 1;
        });
      }

      // ✅ Check reviews inside requests array
      if (pet.requests && pet.requests.length > 0) {
        pet.requests.forEach((req) => {
          if (req.review && req.review.rating) {
            totalRating += req.review.rating;
            totalReviews += 1;
          }
        });
      }
    });

    const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    res.status(200).json({ averageRating: avgRating.toFixed(1), totalReviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
