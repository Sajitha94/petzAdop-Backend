import FosterReview from "../model/FosterReview.js";
import FosterPets from "../model/FosterPets.js";

// POST /api/foster-reviews
export const createFosterReview = async (req, res) => {
  try {
    const { petId, rating, comment } = req.body;
    const fosterParentId = req.user.id;

    const pet = await FosterPets.findById(petId).populate("fosterOrgId", "_id");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    console.log(pet, "pets");

    // ensure foster parent actually fostered this pet (accepted request)
    const acceptedRequest = pet.requests.find(
      (r) =>
        (r.forster_parent_ID.toString() === fosterParentId.toString() &&
          r.status === "accepted") ||
        pet.fosterOrgId._id.toString() === fosterParentId.toString()
    );

    console.log("fosterParentId:", fosterParentId);
    console.log(
      "forster_parent_IDs:",
      pet.requests.map((r) => r.forster_parent_ID.toString())
    );
    console.log("fosterOrgId:", pet.fosterOrgId._id.toString());
    console.log("acceptedRequest:", acceptedRequest);

    console.log(acceptedRequest, "acceptedRequest");
    console.log(
      "compare fosterParentId with requests:",
      pet.requests.map(
        (r) => r.forster_parent_ID.toString() === fosterParentId.toString()
      )
    );
    console.log(
      "compare fosterParentId with org:",
      pet.fosterOrgId._id.toString() === fosterParentId.toString()
    );

    if (!acceptedRequest)
      return res.status(403).json({
        message: "You can only review pets you have fostered.",
      });

    // prevent duplicate review
    const existingReview = await FosterReview.findOne({
      petId,
      fosterParentId,
    });
    if (existingReview)
      return res.status(400).json({ message: "Review already submitted" });

    const newReview = new FosterReview({
      petId,
      fosterParentId,
      fosterOrgId: pet.fosterOrgId._id,
      rating,
      comment,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review submitted successfully", newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getFosterReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all reviews by this user
    const reviews = await FosterReview.find({ fosterParentId: userId });

    res.status(200).json({ status: "success", reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getFosterOrgReviews = async (req, res) => {
  try {
    const { orgId } = req.params; // get org ID from URL

    const reviews = await FosterReview.find({ fosterOrgId: orgId })
      .populate("fosterParentId", "name email") // show reviewer info
      .populate("petId", "name photos"); // show pet info

    res.status(200).json({ status: "success", reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};