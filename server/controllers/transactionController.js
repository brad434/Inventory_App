const Transaction = require("../models/transactionSchema");
const Inventory = require("../models/inventorySchema");

// exports.checkoutItem = async (req, res) => {
//   try {
//     const { itemId, userId, quantity } = req.body; // Make sure these are correctly passed from the frontend
//     console.log(itemId, userId, quantity);

//     // Find the item in the inventory
//     const item = await Inventory.findById(itemId);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     // Check if the item has enough quantity available
//     if (item.quantity < quantity) {
//       return res.status(400).json({
//         message: `Only ${item.quantity} items available. You requested ${quantity}.`,
//       });
//     }

//     // Create a new transaction with the specified quantity
//     const transaction = new Transaction({
//       item: itemId,
//       user: userId,
//       quantity: quantity,
//       status: "Taken",
//     });
//     await transaction.save();

//     // Decrease the quantity of the item in the inventory
//     item.quantity -= quantity;
//     await item.save();

//     res.status(201).json({ message: "Item(s) checked out", transaction });
//   } catch (error) {
//     console.error("Error in checkoutItem:", error); // Ensure error logging is detailed
//     res
//       .status(500)
//       .json({ message: "Failed to checkout item", error: error.message });
//   }
// };

// transactionController.js

exports.checkoutItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user._id; // Use the user object from req.user

    // Find the item in the inventory
    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item has enough quantity available
    if (item.quantity < quantity) {
      return res.status(400).json({
        message: `Only ${item.quantity} items available. You requested ${quantity}.`,
      });
    }

    // Create a new transaction with the specified quantity
    const transaction = new Transaction({
      item: itemId,
      user: userId,
      quantity,
      status: "Taken",
    });
    await transaction.save();

    // Decrease the quantity of the item in the inventory
    item.quantity -= quantity;
    await item.save();

    res.status(201).json({ message: "Item(s) checked out", transaction });
  } catch (error) {
    console.error("Error in checkoutItem:", error);
    res
      .status(500)
      .json({ message: "Failed to checkout item", error: error.message });
  }
};

exports.returnItem = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.status === "Returned") {
      return res.status(400).json({ message: "Invalid transaction" });
    }

    transaction.status = "Returned";
    transaction.returnedAt = Date.now();
    await transaction.save();

    const item = await Inventory.findById(transaction.item);
    item.quantity += 1;
    await item.save();

    res.status(200).json({ message: "Item returned", transaction });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error returning item." });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.params.userId,
    }).populate("item");
    console.log(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve user transactions" });
  }
};
