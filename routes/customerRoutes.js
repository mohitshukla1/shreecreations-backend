const express = require("express");
const customerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter.get("/", customerController.getCustomers);

module.exports = customerRouter;
