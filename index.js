import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/authRouter.js";
import adopPetsRouter from "./src/routes/adopPetsRouter.js";
import cors from "cors";
import chatRouter from "./src/routes/chatRouter.js";
import fosterPetsRouter from "./src/routes/fosterPetsRoutes.js";
import usersRouter from "./src/routes/userRouter.js";
dotenv.config();

const app = express();
app.use("/uploads", express.static("uploads"));

// ===== CORS Configuration =====
const allowedOrigins = [
  "https://petzadop-frontend.onrender.com",
  "https://petzadop-backend.onrender.com",
  "https://petzadop-frontend.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ===== Body Parser =====
app.use(express.json({ limit: "10mb" }));

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("<h1>Application is working</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/postpet", adopPetsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/foster-pet", fosterPetsRouter);
app.use("/api/user-count", usersRoute);
// ===== Error Handling =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
