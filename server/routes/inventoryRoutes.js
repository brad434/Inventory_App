const express = require("express");
const Router = express.Router();
const {
  addItem,
  getAllItems,
  getItemById,
  getItemsByCategory,
  updateItemQuantity,
  deleteItem,
} = require("../controllers/inventoryController.js");

Router.get("/", getAllItems);
Router.get("/id", getItemById);
Router.get("/category/:category", getItemsByCategory);
Router.post("/add", addItem);
Router.put("/:id/update", updateItemQuantity);
Router.delete("/:id/delete", deleteItem);

module.exports = Router;
