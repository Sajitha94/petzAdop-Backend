import { Router } from "express";
import {
  chat_create,
  get_unread_counts,
  mark_as_read,
  get_all_chat,
  get_chat,
} from "../controller/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
const chatRouter = Router();
chatRouter.post("/", protect, chat_create);
chatRouter.get("/unread/:userId", protect, get_unread_counts);
chatRouter.get("/read/:senderId/:receiverId", protect, mark_as_read);
chatRouter.get("/:userId", protect, get_all_chat);
chatRouter.get("/:senderId/:receiverId", protect, get_chat);
export default chatRouter;
