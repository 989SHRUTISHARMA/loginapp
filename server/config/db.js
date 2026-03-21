const mongoose = require('mongoose');

// This function tries to connect to MongoDB using the URI from .env
// We keep this in a separate file so server.js stays clean
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    // The "1" means: exit with failure code
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
