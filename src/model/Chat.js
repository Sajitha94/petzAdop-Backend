import { model, Schema } from "mongoose";

const chatSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },  
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },  
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent", 
  },
  timestamp: { type: Date, default: Date.now } 
});

const Chat = model("Chat", chatSchema);

export default Chat;