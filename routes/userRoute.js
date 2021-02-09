const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const User = require("../models/userModel");

router.get("/login",UserController.showLoginPage);
router.get("/register",UserController.showRegisterPage);
router.get("/logout",UserController.logoutUser);

router.post("/login",UserController.loginUser);
router.post("/register",UserController.registerUser);

router.get("/:id/edit",UserController.editProfile);

router.patch("/:id/edit/profile",UserController.updateProfile);
router.patch("/:id/edit/password",UserController.updatePassword);

module.exports = router;