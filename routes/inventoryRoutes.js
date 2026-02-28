const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const inventoryRouter = express.Router();

inventoryRouter.get("/", inventoryController.getInventory);
inventoryRouter.get("/editInvenotry/:id", inventoryController.getInventoryDetails);
inventoryRouter.get("/:searchString", inventoryController.serchInventory);
inventoryRouter.post('/searchItemCode', inventoryController.searchItemCode);

inventoryRouter.post("/", inventoryController.createInventory);
inventoryRouter.put("/:id", inventoryController.updateInventory);
inventoryRouter.delete("/:id", inventoryController.deleteInventory);


module.exports = inventoryRouter;
