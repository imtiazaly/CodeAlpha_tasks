const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const validate = require("../middleware/validate");

const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require("../validators/orderValidator");

const {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  changeOrderStatus,
  cancelUserOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authMiddleware, createOrderValidation, validate, placeOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.patch(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusValidation,
  validate,
  changeOrderStatus,
);
router.get("/:orderId", authMiddleware, getOrderDetails);
router.patch("/:orderId/cancel", authMiddleware, cancelUserOrder);

module.exports = router;
