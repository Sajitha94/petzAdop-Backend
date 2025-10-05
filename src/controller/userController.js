import User from "../model/User.js";
import AdopPets from "../model/AdopPets.js";
import FosterReview from "../model/FosterReview.js";
import Review from "../model/Reviews.js";

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

    let totalRating = 0;
    let totalReviews = 0;

    // 1️⃣ Reviews from Review table
    const userReviews = await Review.find({ user: userId });

    userReviews.forEach((r) => {
      if (r.rating) {
        totalRating += r.rating;
        totalReviews += 1;
      }
    });

    // 2️⃣ Reviews from FosterReview table
    const fosterReviews = await FosterReview.find({ fosterParentId: userId });

    fosterReviews.forEach((r) => {
      if (r.rating) {
        totalRating += r.rating;
        totalReviews += 1;
      }
    });

    // 3️⃣ Optionally: Reviews on user's pets
    const pets = await AdopPets.find({ post_user: userId });

    pets.forEach((pet) => {
      if (pet.review && pet.review.rating) {
        totalRating += pet.review.rating;
        totalReviews += 1;
      }

      if (pet.reviews && pet.reviews.length > 0) {
        pet.reviews.forEach((r) => {
          totalRating += r.rating;
          totalReviews += 1;
        });
      }

      if (pet.requests && pet.requests.length > 0) {
        pet.requests.forEach((req) => {
          if (req.review && req.review.rating) {
            totalRating += req.review.rating;
            totalReviews += 1;
          }
        });
      }
    });

    // 4️⃣ Calculate average
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    res.status(200).json({
      averageRating: averageRating.toFixed(1),
      totalReviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
