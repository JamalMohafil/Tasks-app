const mongoose = require("mongoose");
const Notification = require("./Notification")
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  workspace:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dateUpload: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Overdue","Failed"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to check overdue tasks
// Middleware to check overdue tasks
taskSchema.pre("save", async function (next) {
  const now = Date.now();

  if (this.status === "Overdue" && this.dueDate > now) {
    this.status = "Pending";
  } else if (
    this.dueDate &&
    this.dueDate < now &&
    this.status !== "Completed"
  ) {
    this.status = "Overdue";
    try {
      const notification = new Notification({
        title: "Task Overdue",
        content: `The task ${this.name} is overdue`,
        receiver: this.user,
        link: "/all-workspaces/" + this.workspace,
      });
      await notification.save(); // Save the notification
    } catch (error) {
      return next(error); // Pass the error to the next middleware
    }
  }

  next();
});


module.exports = mongoose.model("Task", taskSchema);
