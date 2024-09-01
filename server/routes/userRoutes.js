const express = require("express");
const Router = express.Router();
const {
  getAllUsers,
  register,
  login,
  createUser,
} = require("../controllers/userController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

Router.get("/", getAllUsers);
Router.post("/register", register);
Router.post("/login", login);
Router.post("/create-user", authenticateToken, requireAdmin, createUser);

module.exports = Router;
