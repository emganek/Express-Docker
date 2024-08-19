const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/sign-up", userController.signUp);
router.post("/log-in", userController.logIn);

module.exports = router;
