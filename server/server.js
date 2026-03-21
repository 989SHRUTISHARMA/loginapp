const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
// Allows Express to read JSON from request body (req.body)
app.use(express.json());

// Allows frontend (React) to communicate with this backend
// Without this, browser blocks cross-origin requests
app.use(cors());

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// ─── Default Route ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 MERN Auth API is running...' });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
