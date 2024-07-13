const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { createTask, getTasks, updateTask, deleteTask } = require("../Controllers/taskController");
const { auth } = require("../middleware");

// Get all tasks
router.get("/:workspaceId", auth, getTasks);

// Get a single task
router.get("/", async(req, res) => {
  const tasks = await Task.find()
  res.json(tasks);
});

// Create a task
router.post("/", auth, createTask);

// Update a task
router.put("/:taskId", auth, updateTask);

// Delete a task
router.delete("/:id", auth, deleteTask);



module.exports = router;
