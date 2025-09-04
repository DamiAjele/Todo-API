import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (user) => {
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

export default generateAccessToken;
