const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api");
const auth = require("../controllers/auth");

// Define routes
router.get("/users", auth, apiController.getAllUsers);
router.get("/users/:id", auth, apiController.getUserById);
router.post("/users", apiController.createUser);
router.put("/users/:id", auth, apiController.updateUser);
router.delete("/users/:id", auth, apiController.deleteUser);

// Login route
router.post("/login", apiController.loginUser);
router.post("/register", apiController.registerUser);

module.exports = router;
