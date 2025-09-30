import Chat from "../model/Chat.js";
import mongoose from "mongoose";
export const chat_create = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const chat = await Chat.create({
      sender,
      receiver,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error("Chat Create Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const get_all_chat = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          message: 1,
          status: 1,
          timestamp: 1,
          otherUser: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$message" },
          lastStatus: { $first: "$status" },
          lastTimestamp: { $first: "$timestamp" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          lastMessage: 1,
          lastStatus: 1,
          lastTimestamp: 1,
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    console.error("Get User Chats Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_chat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Conversation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
