const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.js");
const authController = require("../middlewares/auth.js");

router.post("/", userController.register);
router.post("/login", userController.login);
router.get("/", authController,userController.getAllUsers);
router.get('/:id', authController, userController.getUserById);
router.patch('/:id', authController, userController.updateUserById);
router.delete('/:id', authController, userController.deleteUserById);

module.exports = router;
