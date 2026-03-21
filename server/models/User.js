const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Schema ───────────────────────────────────────────────────
// A schema defines the "shape" of documents in MongoDB.
// Think of it like a blueprint or table definition.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,              // Removes leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,            // No two users can have the same email
      lowercase: true,         // Stores email in lowercase always
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ─── Pre-Save Hook ────────────────────────────────────────────
// This runs automatically BEFORE saving a user to the database.
// It hashes the password so we never store plain text passwords.
// "salt" adds random data to the hash to make it more secure.
userSchema.pre('save', async function (next) {
  // Only hash if password was actually modified (avoids re-hashing on update)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10); // 10 = complexity rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method ──────────────────────────────────────────
// Custom method on the user object to compare passwords during login.
// bcrypt.compare handles the hashing internally — we never compare plain text.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Model ────────────────────────────────────────────────────
// A model is a class that lets us interact with the "users" collection in MongoDB.
const User = mongoose.model('User', userSchema);

module.exports = User;
