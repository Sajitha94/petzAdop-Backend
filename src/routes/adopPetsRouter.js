import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import {
  adop_pet_create,
  adop_pet_delete,
  adop_pet_list,
  adop_pet_update,
} from "../contoller/adopPetsController.js";

const router = Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // your uploads folder
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

router.put("/:id", protect, adop_pet_update);
router.get("/", protect, adop_pet_list);
router.delete("/:id", protect, adop_pet_delete);

export default router;
