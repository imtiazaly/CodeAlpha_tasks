const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  addProductToCart,
  getUserCart,
  updateCartProduct,
  removeProductFromCart,
} = require("../controllers/cartController");
const {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
} = require("../validators/cartValidator");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addToCartValidation,
  validate,
  addProductToCart,
);
router.get("/", authMiddleware, getUserCart);
router.put(
  "/item/:productId",
  authMiddleware,
  updateCartItemValidation,
  validate,
  updateCartProduct,
);

router.delete(
  "/item/:productId",
  authMiddleware,
  removeCartItemValidation,
  validate,
  removeProductFromCart,
);

module.exports = router;
