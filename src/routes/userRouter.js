import express from "express";
import { get_user_count, getUserRating } from "../controller/userController.js";

const usersRouter = express.Router();

usersRouter.get("/count", get_user_count);
usersRouter.get("/:userId/rating", getUserRating);

export default usersRouter;
