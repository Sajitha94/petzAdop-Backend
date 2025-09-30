import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgotPassword,
  getFosterUsers,
  getProfileById,
  login,
  register,
  setPassword,
  toggleFavorite,
  updateProfile,
  verifyUser,
} from "../contoller/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const authRouter = Router();
authRouter.post(
  "/register",
  upload.fields([{ name: "profilePictures", maxCount: 5 }]),
  register
);
authRouter.post("/login", login);
authRouter.post("/verify", verifyUser);
authRouter.post("/setPassword", setPassword);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/toggle", protect, toggleFavorite);
authRouter.get("/profile/:id", getProfileById);
authRouter.get("/foster-users", getFosterUsers);
authRouter.put(
  "/update/:id",
  protect,
  upload.fields([{ name: "profilePictures", maxCount: 5 }]),
  updateProfile
);
export default authRouter;
