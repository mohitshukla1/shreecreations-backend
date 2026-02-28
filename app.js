const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
// Install: npm install puppeteer
const puppeteer = require('puppeteer');
// Route Imports
const itemRouter = require("./routes/itemRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const orderRouter = require("./routes/orderRoutes");
const inventoryRouter = require("./routes/inventoryRoutes");
const customerRouter = require("./routes/customerRoutes");

const app = express();

// --- 1. DATABASE CONNECTION ---
const connectToDB = async () => {
  try {
    // We use the URI from our config file
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    // On Render, if the DB fails, we want the app to restart/stop
    process.exit(1); 
  }
};

connectToDB();

// --- 2. CORS SETTINGS ---
const allowedOrigins = [
  'https://shreecreations-frontend.onrender.com', // Your live frontend
  'http://localhost:3000',                        // React Local
  'http://localhost:5173'                         // Vite Local
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- 3. MIDDLEWARE & ROUTES ---
app.use(express.json());

app.use("/api/items", itemRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/customer", customerRouter);

// Health check route
app.get("/ping", (req, res) => res.send("pong"));


app.get("/api/orders/:id/pdf", async (req, res) => {
  // try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Replace this with your actual frontend invoice URL
    https://shreecreations-frontend.onrender.com/invoice.html?id=6810da15bfdbbcff2f75fe05
    const invoiceUrl = `https://shreecreations-frontend.onrender.com/invoice.html?id=${req.params.id}`;
    
    await page.goto(invoiceUrl, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    
    await browser.close();
    
    res.contentType("application/pdf");
    res.send(pdf);
  // } catch (e) {
  //   res.status(500).send("Error generating PDF");
  // }
});
// --- 4. STATIC FILES & FRONTEND SERVING ---
// If you are hosting the frontend inside the backend, this serves the 'dist' folder
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
    if (err) {
      // If index.html doesn't exist yet, just send a friendly message
      res.status(200).send("Backend is running. Waiting for frontend build...");
    }
  });
});

// --- 5. SERVER START ---
// Note: We use '0.0.0.0' to make sure Render can "see" the app
app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${config.PORT}`);
});

module.exports = app;