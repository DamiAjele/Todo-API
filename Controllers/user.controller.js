import userModel from "../Models/user.model.js";
import validator from "validator";
import generateAccessToken from "../Utils/accessToken.js";
import generateRefreshToken from "../Utils/refreshToken.js";

// Register Users
export const registerUser = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
      return res.status(400).json({
        message: "Provide all required fields",
        success: false,
        error: true,
      });
    }

    //Checking if User exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered. Please Log in",
        success: false,
        error: true,
      });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format. Enter a valid email address",
        error: true,
      });
    }

    // Validating password strength
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowerCase: 1,
        minUpperCase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and must include at least a uppercase letter, a lowercase letter, a number, and a special character [$,%,@,#, etc]",
        error: true,
      });
    }

    const newUser = await new userModel({
      name,
      userName,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully",
      data: newUser,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Login Users
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide all required field",
        success: false,
        error: true,
      });
    }

    // Check if user is registered
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        success: false,
        error: true,
      });
    }

    //check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        error: true,
      });
    }

    const cookiesOptionsForAccessToken = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, // 1 hr
    };

    const cookiesOptionsForRefreshToken = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, cookiesOptionsForAccessToken);
    res.cookie("refreshToken", refreshToken, cookiesOptionsForRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        lastLoginDate: user.lastLoginDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const user = req.user._id;

    if (!user) {
      return res.status(400).json({
        message: "please log in",
        success: false,
        error: true,
      });
    }

    const cookiesOptionsForAccessToken = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    };

    const cookiesOptionsForRefreshToken = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.clearCookie("accessToken", cookiesOptionsForAccessToken);
    res.clearCookie("refreshToken", cookiesOptionsForRefreshToken);

    const removeRefreshToken = await userModel.findByIdAndUpdate(user, {
      refreshToken: "",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Update User Details
export const updateUserDetails = async (req, res) => {
  try {
    const { name, userName, password } = req.body;
    const user = req.user._id;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (userName) updateFields.userName = userName;
    if (password) updateFields.password = password;

    const updateUser = await userModel.findByIdAndUpdate(
      user,
      updateFields,
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: "updated successfully",
      data: updateUser,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
