import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Log into your account",
        error: true,
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: true,
      });
    }

    // Users data
    req.user = { _id: decode._id };
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};
