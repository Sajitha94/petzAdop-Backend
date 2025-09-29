import { Router } from "express";
import { chat_create } from "../contoller/chatController.js";
const chatRouter = Router();
chatRouter.post("/",chat_create);
export default chatRouter;