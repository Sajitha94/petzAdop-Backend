// routes/fosterPetsRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  createFosterPet,
  getFosterPetsByOrg,
} from "../controller/fosterPetsController.js";
import { protect } from "../middleware/authMiddleware.js";

const fosterPetsRouter = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST foster pet
fosterPetsRouter.post(
  "/",
  protect,
  upload.fields([{ name: "photos" }, { name: "video" }]),
  createFosterPet
);

// GET foster pets by organization
fosterPetsRouter.get("/:orgId", getFosterPetsByOrg);

export default fosterPetsRouter;
