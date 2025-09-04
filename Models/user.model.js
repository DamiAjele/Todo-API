import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: true,
    },

    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
      },
    ],

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash the updated password before saving to database
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }
  next();
});

// Match customer entered password during login with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;
