import Review from "../model/Review.js";
import AdopPets from "../model/AdopPets.js";

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { adopter, fosterParent, requestType, comment, rating } = req.body;
    const userId = req.user.id;

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ message: "Comment and rating are required" });
    }

    // Save review to Reviews collection
    const newReview = await Review.create({
      user: userId,
      adopter: adopter || null,
      fosterParent: fosterParent || null,
      requestType,
      comment,
      rating,
    });

    // If adoption review, update the corresponding request in AdopPets
    if (requestType === "adoption" && adopter) {
      const pet = await AdopPets.findById(adopter);
      if (pet) {
        const request = pet.requests.find(
          (r) => r.adopter_email === req.user.email
        );
        if (request) {
          request.review = { comment, rating, createdAt: new Date() };
          await pet.save();
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name email");
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
