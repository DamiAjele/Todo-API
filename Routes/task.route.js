import express from "express";
import {
  addTask,
  updateTask,
  getSingleTask,
  getAllTasks,
  deleteTask,
  markToComplete,
} from "../Controllers/task.controller.js";
import { auth } from "../Middlewares/auth.js";

const taskRouter = express.Router();

taskRouter.post("/add-task", auth, addTask);
taskRouter.put("/update-task", auth, updateTask);
taskRouter.get("/get-single-task", auth, getSingleTask);
taskRouter.get("/get-all-task", auth, getAllTasks);
taskRouter.delete("/delete-task", auth, deleteTask);
taskRouter.put("/mark-to-complete", auth, markToComplete);

export default taskRouter;
