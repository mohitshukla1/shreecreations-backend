const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8080;

// ALWAYS check process.env first! 
// This is the line that fixed the "127.0.0.1" error.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shree_creations";

module.exports = {
  PORT,
  MONGODB_URI,
};