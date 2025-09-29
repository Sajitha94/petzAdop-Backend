import Chat from "../model/Chat.js";
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
