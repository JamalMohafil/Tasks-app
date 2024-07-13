const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

exports.createTask = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    status,
    isImportant,
    isCompleted,
    dueDate,
    user,
    workspace,
    dateUpload,
  } = req.body;

  // التحقق من وجود المستخدم
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not found", success: false });
  }

  // التحقق من صلاحية المستخدم للدخول إلى مساحة العمل
  if (!req.user.workspaces.includes(workspace)) {
    return res
      .status(403)
      .json({
        message: "You are not allowed to access this workspace",
        success: false,
      });
  }
  const workspaceS = await Workspace.findById(workspace)

  // إنشاء المهمة
  const task = await Task.create({
    name,
    description,
    isImportant,
    isCompleted,
    dueDate,
    user,
    workspace,
    dateUpload,
    status: isCompleted === true ? "Completed" : status,
  });
  await workspaceS.tasks.push(task._id);
  await workspaceS.save();
  res.status(201).json({ task, success: true });
});
// Update a task by ID
exports.updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const {
    name,
    description,
    status,
    isImportant,
    isCompleted,
    dueDate,
    user,
    workspace,
  } = req.body;
  console.log(req.body)
//   // Validate if user is authenticated
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not found", success: false });
  }

  // Ensure user has access to the workspace
  if (!req.user.workspaces.includes(workspace)) {
    return res.status(403).json({
      message: "You are not allowed to access this workspace",
      success: false,
    });
  }

  // Find the task by ID
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found", success: false });
  }

  // Update task fields
  task.name = name || task.name;
  task.description = description || task.description;
  task.status = isCompleted ? "Completed" : status || task.status;
  task.isImportant = isImportant !== undefined ? isImportant : task.isImportant;
  task.isCompleted = isCompleted !== undefined ? isCompleted : task.isCompleted;
  task.dueDate = dueDate || task.dueDate;

  task.user = user || task.user;

  // Save the updated task
  await task.save();

  res.status(200).json({ task, success: true });
});
exports.getTasks = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  if (!workspaceId) {
    return res
      .status(400)
      .json({ success: false, message: "Workspace is required" });
  }

  const workspace = await Workspace.findById(workspaceId).select(
    "members admins createdBy"
  );

  if (!workspace) {
    return res
      .status(404)
      .json({ success: false, message: "Workspace not found" });
  }

  if (
    !workspace.admins.includes(req.user._id) &&
    !workspace.members.includes(req.user._id) &&
    workspace.createdBy.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to access this workspace",
    });
  }

  // Initialize filters with workspaceId
  const filters = { workspace: workspaceId };

  // Check for user filter
  if (req.query.user) {
    filters.user = req.query.user;
  }

  // Check for status filter
  if (req.query.status && req.query.status !== "All" && req.query.status !== "Important") {

      filters.status = req.query.status;
    
  }
  if(req.query.status && req.query.status === "Important"){
    filters.isImportant = true
  }

  // Define sorting order based on sort query
  const sort = req.query.sort === "Oldest" ? "date" : "-date";

  // Define limit for tasks
  const limit = parseInt(req.query.limit, 10) || 10;

  // Find tasks with applied filters
  const workspaceTasks = await Task.find(filters)
    .sort(sort)
    .limit(limit)
    .populate("user");

  return res.status(200).json({ success: true, tasks: workspaceTasks });
});



exports.deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  // تحقق من أن taskId موجود وليس فارغًا
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });
  }

  // تحقق من صحة taskId كـ ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ success: false, message: "Invalid Task ID" });
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized to access this task" });
  }

  await Task.findByIdAndDelete(taskId);

  res.status(200).json({ success: true, message: "Task deleted successfully" });
});
