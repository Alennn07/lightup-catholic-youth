import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Default test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running with Auth + MongoDB!");
});

// Server
const PORT = process.env.PORT || 5000

// Environment-controlled logging
const shouldLog = process.env.ENABLE_BACKEND_LOGGING === 'true' || process.env.NODE_ENV === 'development'

app.listen(PORT, () => {
  if (shouldLog) {
    console.log(`🚀 Server running on port ${PORT}`)
  }
})
