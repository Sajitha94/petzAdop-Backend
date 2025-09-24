import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { login, register } from "../contoller/authController.js";

const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
export default authRouter;
