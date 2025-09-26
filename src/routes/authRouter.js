import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgotPassword,
  getProfile,
  login,
  register,
  setPassword,
  updateProfile,
  verifyUser,
} from "../contoller/authController.js";

const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify", verifyUser);
authRouter.post("/setPassword", setPassword);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.get("/profile", protect, getProfile);
authRouter.put("/update/:id", protect, updateProfile);
export default authRouter;
