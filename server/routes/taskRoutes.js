// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// ─── Routes for /api/tasks ───────────────────────────────────────────────────

router.route('/')
  .get((req, res, next) => {
    console.log(`Route hit: GET /api/tasks`);
    next();
  }, getTasks)        // GET  /api/tasks  → return all tasks
  .post((req, res, next) => {
    console.log(`Route hit: POST /api/tasks`);
    next();
  }, createTask);     // POST /api/tasks  → create a new task

// ─── Routes for /api/tasks/:id ───────────────────────────────────────────────

router.route('/:id')
  .get((req, res, next) => {
    console.log(`Route hit: GET /api/tasks/${req.params.id}`);
    next();
  }, getTaskById)     // GET    /api/tasks/:id  → return single task
  .put((req, res, next) => {
    console.log(`Route hit: PUT /api/tasks/${req.params.id}`);
    next();
  }, updateTask)      // PUT    /api/tasks/:id  → update task fields
  .delete((req, res, next) => {
    console.log(`Route hit: DELETE /api/tasks/${req.params.id}`);
    next();
  }, deleteTask);     // DELETE /api/tasks/:id  → remove task

module.exports = router;
