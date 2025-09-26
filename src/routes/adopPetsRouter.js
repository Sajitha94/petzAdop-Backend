import { Router } from "express";
import {
  adop_pet_create,
  adop_pet_deletePet,
  adop_pet_deletePhoto,
  adop_pet_deleteVideo,
  adop_pet_get,
  adop_pet_list,
  adop_pet_update,
} from "../contoller/adopPetsController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const adopPetsRouter = Router();

// photos = multiple, video = single
adopPetsRouter.post(
  "/",
  protect,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adop_pet_create
);
adopPetsRouter.put(
  "/:id",
  protect,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adop_pet_update
);

adopPetsRouter.get("/", protect, adop_pet_list);
// routes/adopPetsRouter.js
adopPetsRouter.delete("/:id", protect, adop_pet_deletePet); // ✅ new route

adopPetsRouter.put("/photo/:id", protect, adop_pet_deletePhoto);
adopPetsRouter.put("/video/:id", protect, adop_pet_deleteVideo);
adopPetsRouter.get("/:id", adop_pet_get);

export default adopPetsRouter;
