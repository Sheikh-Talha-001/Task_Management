// server/index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express    = require('express');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi  = require('swagger-ui-express');

const connectDB     = require('./config/db');
const swaggerSpec   = require('./config/swaggerConfig');
const authRoutes    = require('./routes/auth');
const taskRoutes    = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const cors = require('cors');

const app = express();

// Enable CORS for all routes (to allow requests from the Vite frontend)
app.use(cors());

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware ──────────────────────────────────────────────────────

// 1. Helmet — sets secure HTTP response headers
app.use(helmet());

// 2. Rate Limiter — 100 requests per 15 minutes per IP (active in all envs)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per window
  standardHeaders: true,     // return rate limit info in RateLimit-* headers
  legacyHeaders: false,      // disable X-RateLimit-* legacy headers
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());

// 3. Mongo Sanitize — strips $ and . from req.body, req.query, req.params
//    to prevent NoSQL injection attacks
app.use(mongoSanitize());

// ─── API Documentation (development + production) ────────────────────────────
// Swagger UI is always available; restrict in production via env var if needed
if (process.env.NODE_ENV !== 'test') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Task Management API Docs',
      swaggerOptions: {
        docExpansion: 'list',  // expand operation list by default
        filter: true,          // enable search bar
      },
    })
  );
  console.log(
    `📄 Swagger docs available at http://localhost:${process.env.PORT || 5000}/api-docs`
  );
}

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);   // Public: register & login
app.use('/api/tasks', taskRoutes);  // Protected: requires JWT

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route '${req.originalUrl}' not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🛠️`);
});