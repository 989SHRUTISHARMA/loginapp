const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect Middleware ───────────────────────────────────────
// This is a "gatekeeper" for protected routes like /api/user/dashboard.
// It runs BEFORE the actual route handler.
//
// How it works:
//  1. Reads the Authorization header from the request
//  2. Expects the format: "Bearer <token>"
//  3. Verifies the token using our JWT_SECRET
//  4. Looks up the user in MongoDB and attaches them to req.user
//  5. If anything fails, it blocks access with a 401 Unauthorized

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token — if tampered or expired, this throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID stored inside the token
      // We exclude the password field from the result for security
      req.user = await User.findById(decoded.id).select('-password');

      // Pass control to the actual route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
