const express = require("express");
const orderController = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/", orderController.getOrders);
orderRouter.get("/orderCount", orderController.orderCount);
orderRouter.get("/:id", orderController.getOrderInfo);
orderRouter.post("/", orderController.createOrder);
orderRouter.post("/searchOrder", orderController.searchOrder);
orderRouter.post("/normalOrder", orderController.normalOrder);
orderRouter.post("/returnOrder", orderController.returnOrder);
orderRouter.post("/saleReport", orderController.saleReport);

// orderRouter.put("/:id", orderController.editItem);
// orderRouter.delete("/:id", orderController.deleteItem);

module.exports = orderRouter;
