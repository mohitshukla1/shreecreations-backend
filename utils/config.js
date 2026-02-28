const dotenv = require("dotenv");
dotenv.config();

// Use the PORT Render gives you, or default to 8080 for local testing
const PORT = process.env.PORT || 8080;

// Use the Cloud URI from Render, or fall back to your local DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shree_creations";

module.exports = {
  PORT,
  MONGODB_URI,
};