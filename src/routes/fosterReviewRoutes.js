import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createFosterReview,
  getFosterReviews,
} from "../controller/fosterReviewController.js";

const router = express.Router();

router.post("/", protect, createFosterReview);
router.get("/", protect, getFosterReviews);

export default router;
