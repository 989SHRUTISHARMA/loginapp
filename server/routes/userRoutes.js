const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// GET /api/user/dashboard
// This route is PROTECTED — only logged-in users with a valid JWT can access it.
// The `protect` middleware runs first and attaches req.user before the handler.
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({
    message: `Welcome to the Dashboard, ${req.user.name}! 🎉`,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;
