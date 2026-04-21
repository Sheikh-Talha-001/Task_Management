// server/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mount task routes at /api/tasks
app.use('/api/tasks', taskRoutes);
// app.use((req, res, next) => {
//   console.log(`Request hit: ${req.method} ${req.originalUrl}`);
//   next();
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🛠️`);
});