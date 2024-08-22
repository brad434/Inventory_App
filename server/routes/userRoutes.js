const express = require("express");
const Router = express.Router();
const {
  getAllUsers,
  register,
  login,
} = require("../controllers/userController");

Router.get("/", getAllUsers);
Router.post("/register", register);
Router.post("/login", login);

module.exports = Router;
