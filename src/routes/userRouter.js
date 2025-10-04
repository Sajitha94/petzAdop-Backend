import express from "express";
import { get_user_count } from "../controller/userController.js";

const usersRouter = express.Router();

usersRouter.get("/count", get_user_count);

export default usersRouter;
