import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgotPassword,
  getProfileById,
  login,
  register,
  setPassword,
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
authRouter.get("/profile/:id", getProfileById);

authRouter.put("/update/:id", protect, updateProfile);
export default authRouter;
