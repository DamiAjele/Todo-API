import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      enum: ["Work", "Personal", "School", "Other"],
      required: true,
    },

    deadline: {
      type: Date,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose virtual setter for date
taskSchema.virtual("date").set(function (date) {
  this._date = date; // takes input as date
});

// Mongoose virtual setter for time
taskSchema.virtual("time").set(function (time) {
  this._time = time; // takes input as time
});

// Pre-validate merged date and time for the deadline before saving
taskSchema.pre("validate", function (next) {
  if (this._date && this._time) {
    this.deadline = new Date(`${this._date}T${this._time}:00.000Z`);
  }
  next();
});

// save merged date and time into deadline before saving to DB
taskSchema.pre("save", function (next) {
  if (this.date && this.time) {
    const dateTimeString = `${this.date}T${this.time}`;
    this.deadline = new Date(dateTimeString) + 1;
  }
  next();
});

//Update the merged date and time into deadline before saving to DB
taskSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.date && update.time) {
    const deadline = new Date(`${update.date}T${update.time}:00Z`) + 1;
    update.deadline = deadline;
    this.setUpdate(update);
  }

  next();
});

// Mongoose virtual getter to extract date & time from deadline for client fetching
taskSchema.virtual("date").get(function () {
  return this.deadline ? this.deadline.toISOString().split("T")[0] : null;
});

taskSchema.virtual("time").get(function () {
  return this.deadline
    ? this.deadline.toISOString().split("T")[1].slice(0, 5)
    : null;
});

const taskModel = mongoose.models.task || mongoose.model("Task", taskSchema);

export default taskModel;
