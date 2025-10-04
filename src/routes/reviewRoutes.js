import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createReview, getReviews } from "../controller/reviewController.js";

const router = Router();

// Routes
router.post("/", protect, createReview); // Create review
router.get("/", getReviews); // Get all reviews

export default router; // ✅ important: default export
