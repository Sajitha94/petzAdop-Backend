import express from "express";
import {
  get_user_count,
  getUserRatingAndComments,
} from "../controller/userController.js";

const usersRouter = express.Router();

usersRouter.get("/count", get_user_count);
usersRouter.get("/:userId/rating", getUserRatingAndComments);

export default usersRouter;
