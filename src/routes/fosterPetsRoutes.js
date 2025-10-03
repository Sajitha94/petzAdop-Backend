// routes/fosterPetsRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  createFosterPet,
  getAllFosterPets,
  getFosterPetsByOrg,
  requestAdoption,
  updateRequestStatus,
} from "../controller/fosterPetsController.js";
import { protect } from "../middleware/authMiddleware.js";

const fosterPetsRouter = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage ,limits: { fileSize: 5 * 1024 * 1024 }});

// POST foster pet
fosterPetsRouter.post(
  "/",
  protect,
  upload.fields([{ name: "photos" }, { name: "video" }]),
  createFosterPet
);
fosterPetsRouter.post("/request", protect, requestAdoption);

// POST update request status
fosterPetsRouter.post(
  "/request/:petId/:requestId",
  protect,
  updateRequestStatus
);
// GET foster pets by organization getAllFosterPets
fosterPetsRouter.get("/:orgId", getFosterPetsByOrg);
fosterPetsRouter.get("/", getAllFosterPets);

export default fosterPetsRouter;
