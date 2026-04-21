// server/controllers/taskController.js
const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper: validate MongoDB ObjectId early to return clean 400 errors
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    console.log('Inside createTask controller');
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  // Validate ObjectId format before hitting the database
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid task ID: '${req.params.id}'` });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: `Task with ID '${req.params.id}' not found` });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(`[getTaskById] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// @desc    Update a task by ID
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  // Validate ObjectId format before hitting the database
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid task ID: '${req.params.id}'` });
  }

  // Reject empty update payloads
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Update body cannot be empty' });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true } // Return updated doc & run schema validators
    );

    if (!task) {
      return res.status(404).json({ message: `Task with ID '${req.params.id}' not found` });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(`[updateTask] Error: ${error.message}`);
    // Mongoose validation errors (e.g. invalid enum value) → 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  // Validate ObjectId format before hitting the database
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid task ID: '${req.params.id}'` });
  }

  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: `Task with ID '${req.params.id}' not found` });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`[deleteTask] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
