const express = require("express");
const router = express.Router();
const {
  checkoutItem,
  returnItem,
  getUserTransactions,
} = require("../controllers/transactionController");

router.post("/checkout", checkoutItem);

router.post("/return/:id", returnItem);

router.get("/user/:userId", getUserTransactions);

module.exports = router;
