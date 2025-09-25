import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/authRouter.js";
import adopPetsRouter from "./src/routes/adopPetsRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== CORS Configuration =====
app.use(
  cors({
    origin: ["http://localhost:5173", "https://petzadop-frontend.onrender.com"],
    credentials: true,
  })
);

// ===== Body Parser =====
app.use(express.json());

// ===== Serve Uploads Folder =====
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // <-- corrected

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
