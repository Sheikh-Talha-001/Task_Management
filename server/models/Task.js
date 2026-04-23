// server/models/Task.js
const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    // The user who owns this task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Task title - required, trimmed of whitespace
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },

    // Optional description - trimmed of whitespace
    description: {
      type: String,
      trim: true,
    },

    // Status of the task - restricted to specific values
    status: {
      type: String,
      required: [true, 'Task status is required'],
      enum: ['Pending', 'In Progress', 'Completed'],
      message: 'Status must be Pending, In Progress, or Completed',

      default: 'Pending',
    },

    // Optional due date for the task
    dueDate: {
      type: Date,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
