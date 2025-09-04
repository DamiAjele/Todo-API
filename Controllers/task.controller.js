import taskModel from "../Models/task.model.js";
import userModel from "../Models/user.model.js";

//Add task by Users (Create)
export const addTask = async (req, res) => {
  try {
    const { title, description, category, date, time } = req.body;
    const user = req.user._id;
    console.log(user);

    if (!title) {
      return res.status(400).json({
        message: "Provide a title",
      });
    }

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and Time required",
        error: true,
      });
    }

    // Check date
    if (date < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be in the past",
        error: true,
      });
    }

    //Check Category
    const allowedCategories = ["Work", "School", "Personal", "Other"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Choose from: ${allowedCategories.join(
          ", "
        )}`,
      });
    }

    const newTask = await new taskModel({
      title,
      description,
      category,
      date,
      time,
      user: user,
    });

    const savedTask = await newTask.save();

    //modify user account
    await userModel.findByIdAndUpdate(
      user,
      {
        $push: { tasks: savedTask.id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
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

// Update task details by users (Update)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const { title, description, date, time, category } = req.body;
    const user = req.user._id;
    console.log(user);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (date) updateFields.date = date;
    if (date || time) {
      const task = await taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
          error: true,
        });
      }

      const currentDeadline = task.deadline
        ? new Date(task.deadline)
        : new Date();

      // Update only date part
      if (date) {
        const newDate = new Date(date);
        currentDeadline.setFullYear(newDate.getFullYear());
        currentDeadline.setMonth(newDate.getMonth());
        currentDeadline.setDate(newDate.getDate());
      }

      // Update only time part
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        currentDeadline.setHours(hours);
        currentDeadline.setMinutes(minutes);
        currentDeadline.setSeconds(0);
        currentDeadline.setMilliseconds(0);
      }

      updateFields.deadline = currentDeadline;
    }
    if (category) {
      const allowedCategories = ["Work", "School", "Personal", "Other"];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Choose from: ${allowedCategories.join(
            ", "
          )}`,
        });
      }
      updateFields.category = category;
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      updateFields,
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: "updated successfully",
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

// Get Single task by user (Read)
export const getSingleTask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const user = req.user._id;
    console.log(user);

    const task = await taskModel.findById(taskId).populate("user");
    if (!task) {
      return res.status(400).json({
        message: "Task not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
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

// Get all tasks by user (Read)
export const getAllTasks = async (req, res) => {
  try {
    const user = req.user._id;

    const getTasks = await taskModel.find({ user: user });
    if (!getTasks) {
      return res.status(400).json({
        success: false,
        message: "No task by this user",
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: getTasks,
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

// Delete task by User
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const user = req.user._id;

    //Check for post existence
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(400).json({
        message: "task does not exist",
        success: false,
        error: true,
      });
    }

    //Check if its the same user
    if (user === task.user) {
      return res.status(200).json({
        message: "successful",
        success: false,
        error: true,
      });
    }

    await taskModel.findByIdAndDelete(taskId);
    return res.status(200).json({
      message: "task deleted successfully",
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

// update task to completed
export const markToComplete = async (req, res) => {
  try {
    const { taskId } = req.query;
    const user = req.user._id;

    if (!taskId) {
      return res.status(400).json({
        message: "task unavailable",
        success: false,
        error: true,
      });
    }

    const completedTask = await taskModel.findOneAndUpdate(
      { _id: taskId, user: user },
      { $set: { completed: true } },
      { new: true }
    );

    if (!completedTask) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task marked as complete",
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
