const express = require("express");

const { register, login, getMe } = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
