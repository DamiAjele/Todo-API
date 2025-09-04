import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.route.js";
import taskRouter from "./Routes/task.route.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to mongoDB, error");
  });

//Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
