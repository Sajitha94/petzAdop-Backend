import User from "../model/User.js";
import AdopPets from "../model/AdopPets.js";
import FosterReview from "../model/FosterReview.js";
import Review from "../model/Review.js";

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

// userController.js
export const getUserRatingAndComments = async (req, res) => {
  try {
    const { userId } = req.params;

    let totalRating = 0;
    let totalReviews = 0;
    let allComments = [];

    // 1️⃣ Reviews from Review table (user)
    const userReviews = await Review.find({ user: userId })
      .populate("adopter", "name")
      .populate("user", "name");
    console.log(userReviews, "ude");

    userReviews.forEach((r) => {
      if (r.rating) {
        totalRating += r.rating;
        totalReviews += 1;
      }
      if (r.comment) {
        allComments.push({
          comment: r.comment,
          rating: r.rating,
          type: r.requestType || "adoption",
          pet: r.adopter?.name || null,
          reviewerName: r.user?.name || null,
          source: "Review",
          createdAt: r.createdAt,
        });
      }
    });

    // 2️⃣ FosterReviews
    const fosterReviews = await FosterReview.find({ fosterParentId: userId })
      .populate("petId", "name")
      .populate("fosterOrgId", "name");

    fosterReviews.forEach((r) => {
      if (r.rating) {
        totalRating += r.rating;
        totalReviews += 1;
      }
      if (r.comment) {
        allComments.push({
          comment: r.comment,
          rating: r.rating,
          pet: r.petId?.name || null,
          organization: r.fosterOrgId?.name || null,
          source: "FosterReview",
          createdAt: r.createdAt,
        });
      }
    });

    // 3️⃣ Pet reviews (only comments)
    const pets = await AdopPets.find({ post_user: userId }).populate({
      path: "reviews",
      select: "comment createdAt",
    });

    pets.forEach((pet) => {
      if (pet.reviews && pet.reviews.length > 0) {
        pet.reviews.forEach((r) => {
          if (r.comment) {
            allComments.push({
              comment: r.comment,
              rating: null,
              pet: pet.name,
              source: "PetReview",
              createdAt: r.createdAt,
            });
          }
        });
      }
    });

    // Group by pet
    const reviewsByPet = {};
    allComments.forEach((c) => {
      const petName = c.pet || "Unknown Pet";
      if (!reviewsByPet[petName]) {
        reviewsByPet[petName] = [];
      }
      reviewsByPet[petName].push(c);
    });

    const petReviewsArray = Object.keys(reviewsByPet).map((petName) => ({
      petName,
      reviews: reviewsByPet[petName],
    }));

    // Response
    res.status(200).json({
      averageRating:
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0",
      totalReviews,
      petReviews: petReviewsArray,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
