const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const validate = require("../middleware/validate");
const {
  createProductValidation,
  productIdValidation,
} = require("../validators/productValidator");

const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProductValidation,
  validate,
  createProduct,
);
router.get("/", getProducts);
router.get("/:id", productIdValidation, validate, getProductById);

module.exports = router;