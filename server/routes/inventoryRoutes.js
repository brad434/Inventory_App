const express = require("express");
const Router = express.Router();
const {
  addItem,
  getAllItems,
  getItemById,
  updateItemQuantity,
  deleteItem,
} = require("../controllers/inventoryController");

Router.get("/", getAllItems);
Router.get("/id", getItemById);
Router.post("/add", addItem);
Router.put("/:id/update", updateItemQuantity);
Router.delete("/:id/delete", deleteItem);

module.exports = Router;
