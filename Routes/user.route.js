import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserDetails,
} from "../Controllers/user.controller.js";
import { auth } from "../Middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", auth, logoutUser);
userRouter.put("/update-user", auth, updateUserDetails);

export default userRouter;
