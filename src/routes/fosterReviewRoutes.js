import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createFosterReview,
  getFosterOrgReviews,
  getFosterReviews,
} from "../controller/fosterReviewController.js";

const router = express.Router();

router.post("/", protect, createFosterReview);
router.get("/",  getFosterReviews);
router.get("/org/:orgId",  getFosterOrgReviews);

export default router;
