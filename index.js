import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/authRouter.js";
import adopPetsRouter from "./src/routes/adopPetsRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

// ===== CORS Configuration =====
app.use(cors({
  origin: "*", // Allow all origins; in production, replace "*" with your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS requests for all routes
app.options("*", cors());

// ===== Body Parser =====
app.use(express.json());

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("<h1>Application is working</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/postpet", adopPetsRouter);

// ===== Error Handling =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
