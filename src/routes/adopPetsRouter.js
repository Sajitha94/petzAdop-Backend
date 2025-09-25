import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  adop_pet_create,
  adop_pet_delete,
  adop_pet_list,
  adop_pet_update,
} from "../contoller/adopPetsController.js";
import { upload } from "../middleware/uploadMiddleware.js"; // new absolute path Multer

const router = Router();

router.post(
  "/",
  protect,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adop_pet_create
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adop_pet_update
);

router.get("/", protect, adop_pet_list);
router.delete("/:id", protect, adop_pet_delete);

export default router;
