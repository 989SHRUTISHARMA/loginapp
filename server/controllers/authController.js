const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─────────────────────────────────────────────────────────────
// STEP 4: REGISTER USER
// Route:  POST /api/auth/register
// Access: Public (anyone can call this)
// ─────────────────────────────────────────────────────────────
// What happens here:
//  1. Get name, email, password from the request body
//  2. Check if a user with that email already exists
//  3. Create a new user (password auto-hashed via model hook)
//  4. Return the user info + JWT token
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validate input fields ──────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // ── Check if user already exists ──────────────────────
    // We query MongoDB to find a document where email matches
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // ── Create new user ───────────────────────────────────
    // The password is automatically hashed by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    // ── Respond with user data + token ────────────────────
    // We send back a JWT token so the user is "logged in" immediately
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // JWT for authentication
      });
    }
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 5: LOGIN USER
// Route:  POST /api/auth/login
// Access: Public
// ─────────────────────────────────────────────────────────────
// What happens here:
//  1. Get email and password from the request body
//  2. Find the user by email in MongoDB
//  3. Compare the entered password with the hashed password
//  4. If they match, return user info + JWT token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate input ────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // ── Find user by email ────────────────────────────────
    const user = await User.findOne({ email });

    // ── Compare passwords ─────────────────────────────────
    // matchPassword() is our custom method defined in User.js
    // It uses bcrypt.compare() internally — never plain text comparison
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // We intentionally use a vague message — don't tell hackers which part is wrong
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
