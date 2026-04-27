# Donezo - Task Management Dashboard

Donezo is a production-ready, full-stack Task Management Dashboard built to help individuals and teams organize their workflow efficiently. 
It features a stunning, highly responsive user interface with dynamic animations, comprehensive analytics, global settings (including true Dark Mode and i18n), and robust backend security.

## 🚀 Features

### Frontend (Client)
- **Modern UI/UX:** Built with React, TypeScript, and Tailwind CSS v4. Features premium aesthetics, glassmorphism, and smooth micro-interactions.
- **Design System:** Implements a highly cohesive, component-driven design system. Includes a tailored color palette utilizing `emerald` accents, a true `neutral` (black) grayscale for Dark Mode, and a `slate` (blueish) grayscale for Light Mode. Typography, padding, and animations are strictly standardized.
- **Advanced Animations:** Utilizes Framer Motion and GSAP for seamless page transitions, staggered list appearances, and interactive elements.
- **Global Settings System:** A persistent `SettingsContext` that handles:
  - **Dark Mode:** A true "black type" dark theme that seamlessly overrides the default light theme using Tailwind v4's CSS variables system.
  - **Internationalization (i18n):** Support for multiple languages (English, Spanish, French, German).
  - **Notification Controls:** Toggles for Push Notifications and Email Alerts.
- **Task Management:** Create, edit, and organize tasks by priority (Low, Medium, High, Urgent) and status (Pending, In Progress, Completed).
- **Time Tracking:** Built-in mini time tracker for individual tasks.
- **Real-Time Analytics:** Visualizes productivity metrics, velocity, completion rates, and status breakdowns using Recharts.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewports.

### Backend (Server)
- **RESTful API:** Built with Node.js and Express.js.
- **Database:** MongoDB integration using Mongoose for robust data modeling.
- **Authentication:** Secure user authentication using JSON Web Tokens (JWT) and bcrypt password hashing.
  - *Note: JWT tokens are stored locally in the browser's `localStorage` and implement an expiration technique where tokens automatically expire after 7 days (`expiresIn: '7d'`), requiring the user to re-authenticate for continued security.*
- **Rate Limiting:** Protects the API against brute-force and DDoS attacks using the `express-rate-limit` middleware, which restricts the number of requests a single IP can make within a specified timeframe.
- **Error Handling:** Employs a robust, centralized error-handling middleware. It safely intercepts thrown exceptions, standardizes the API response format, and prevents sensitive stack traces from leaking into production while logging detailed errors during development.
- **API Documentation:** Swagger/OpenAPI integration for easy endpoint testing and exploration.

## 🛠️ Technology Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS v4
- Framer Motion & GSAP (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Vite (Build Tool)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- swagger-jsdoc & swagger-ui-express

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd Task_Management
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGIN=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory and add:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Running Both Simultaneously
If you have a root `package.json` configured with concurrently, you can run from the root folder:
```bash
npm run dev:all
```

## 🌐 API Documentation
Once the backend server is running, you can access the Swagger API documentation at:
`http://localhost:5000/api-docs`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
