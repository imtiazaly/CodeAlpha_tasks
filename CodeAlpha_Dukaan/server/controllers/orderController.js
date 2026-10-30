const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../services/orderService");

const placeOrder = async (req, res) => {
  try {
    const order = await createOrder(req.user.userId, req.body.shippingAddress);

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    const clientErrors = [
      "Cart is empty",
      "A product in your cart no longer exists",
    ];

    if (
      clientErrors.includes(error.message) ||
      error.message.startsWith("Insufficient stock for ")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Place order error:", error);

    return res.status(500).json({
      message: "Failed to place order",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await getMyOrders(req.user.userId);

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await getOrderById(req.user.userId, req.params.orderId);

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to fetch order details",
    });
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatus(req.params.orderId, req.body.status);

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

const cancelUserOrder = async (req, res) => {
  try {
    const order = await cancelOrder(req.user.userId, req.params.orderId);

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Cancel order error:", error);

    return res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  changeOrderStatus,
  cancelUserOrder,
};