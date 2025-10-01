import { Router } from "express";
import {
  chat_create,
  get_unread_counts,
  mark_as_read,
  get_all_chat,
  get_chat,
} from "../controller/chatController.js";
const chatRouter = Router();
chatRouter.post("/", chat_create);
chatRouter.get("/unread/:userId", get_unread_counts);
chatRouter.get("/read/:senderId/:receiverId", mark_as_read);
chatRouter.get("/:userId", get_all_chat);
chatRouter.get("/:senderId/:receiverId", get_chat);
export default chatRouter;
