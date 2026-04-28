// server/controllers/taskController.js
const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper: validate MongoDB ObjectId early to return clean 400 errors
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     description: Creates a new task document in MongoDB with the provided fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           example:
 *             title: "Build REST API"
 *             description: "Set up Express routes and MongoDB models"
 *             status: "In Progress"
 *             dueDate: "2025-12-31T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    console.log('Inside createTask controller');
    // Attach the authenticated user's ID to the task before saving
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// READ ALL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     description: Returns an array of all task documents stored in MongoDB.
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// @desc    Get all tasks belonging to the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Base query: Only return tasks that belong to the authenticated user
    const query = { user: req.user._id };

    // Apply search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with .lean() for faster, read-only JSON responses
    const tasks = await Task.find(query).lean();
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// READ ONE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get a single task by ID
 *     description: Finds and returns a single task using its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task
 *         example: 6629f3a2b4e2c10012345abc
 *     responses:
 *       200:
 *         description: Task found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid task ID: 'abc123'"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Task with ID '6629f3a2b4e2c10012345abc' not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

    // Verify that the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(`[getTaskById] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update a task by ID
 *     description: >
 *       Updates the specified fields of an existing task.
 *       Runs Mongoose schema validators on the incoming data.
 *       Returns the updated document.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task to update
 *         example: 6629f3a2b4e2c10012345abc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           example:
 *             status: "Completed"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid ID format, empty body, or schema validation failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
    // First, check if the task exists and belongs to the authenticated user
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: `Task with ID '${req.params.id}' not found` });
    }

    // Verify ownership before allowing the update
    if (existingTask.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true } // Return updated doc & run schema validators
    );

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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task by ID
 *     description: Permanently removes a task document from MongoDB by its ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task to delete
 *         example: 6629f3a2b4e2c10012345abc
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  // Validate ObjectId format before hitting the database
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid task ID: '${req.params.id}'` });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: `Task with ID '${req.params.id}' not found` });
    }

    // Verify ownership before allowing deletion
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`[deleteTask] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
