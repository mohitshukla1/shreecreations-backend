const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
const itemRouter = require("./routes/itemRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const orderRouter = require("./routes/orderRoutes");
const inventoryRouter = require("./routes/inventoryRoutes");
const customerRouter = require("./routes/customerRoutes");
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const app = express();
const url = "mongodb://localhost:27017/shree_creations";
const connectToDB = async (url) => {
  await mongoose.connect(url);
  console.log(`Connected to DB`);
};

url ? connectToDB(url) : console.log("Error connecting to DB");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const allowedOrigins = [
  'https://shreecreations-frontend.onrender.com', // Your live frontend
  'http://localhost:3000',                        // Local development
  'http://localhost:5173'                         // Vite local development
];

// 2. Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or plain curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/api/items", itemRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/customer", customerRouter);

app.get("/example", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.static(path.join(__dirname, "dist")));

module.exports = app;
