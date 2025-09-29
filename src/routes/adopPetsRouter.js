import { Router } from "express";
import {
  adop_pet_create,
  adop_pet_deletePet,
  adop_pet_deletePhoto,
  adop_pet_deleteVideo,
  adop_pet_get,
  adop_pet_getBreeds,
  adop_pet_getRequests,
  adop_pet_list,
  adop_pet_request,
  adop_pet_search,
  adop_pet_update,
  adop_pet_updateRequestStatus,
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

adopPetsRouter.get("/", adop_pet_list);
// routes/adopPetsRouter.js
adopPetsRouter.delete("/:id", protect, adop_pet_deletePet); // ✅ new route

adopPetsRouter.put("/photo/:id", protect, adop_pet_deletePhoto);
adopPetsRouter.put("/video/:id", protect, adop_pet_deleteVideo);
adopPetsRouter.get("/search", adop_pet_search);
adopPetsRouter.get("/breeds", adop_pet_getBreeds);
adopPetsRouter.post("/request", protect, adop_pet_request);

adopPetsRouter.get("/requests", protect, adop_pet_getRequests);

// Accept/Reject request
adopPetsRouter.post(
  "/request/:petId/:requestId",
  protect,
  adop_pet_updateRequestStatus
);
adopPetsRouter.get("/:id", adop_pet_get);

export default adopPetsRouter;
