import { Router } from "express";
import {
  adop_pet_create,
  adop_pet_delete,
  adop_pet_list,
  adop_pet_update,
} from "../contoller/adopPetsController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/",
  protect,
  upload.fields([
    { name: "photos", maxCount: 5 }, // multiple photos
    { name: "video", maxCount: 1 }, // single video
  ]),
  adop_pet_create
);

router.put("/:id", protect, adop_pet_update); // Update pet
router.get("/", protect, adop_pet_list); // List all pets
router.delete("/:id", protect, adop_pet_delete); // Delete pet

export default router;
