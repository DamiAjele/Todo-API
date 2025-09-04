import userModel from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const updateRefreshToken = await userModel.updateOne(
    { _id: user },
    { refreshToken: token }
  );

  return token;
};

export default generateRefreshToken;
