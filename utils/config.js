const dotenv = require("dotenv");
dotenv.config();

const PORT = 8080;
const MONGODB_URI = "mongodb://localhost:27017/shree_creations";
  // process.env.NODE_ENV === "test"
  //   ? process.env.TEST_MONGODB_URI
  //   : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
