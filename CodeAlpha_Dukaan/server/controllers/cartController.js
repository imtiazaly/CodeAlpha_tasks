const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../services/cartService");

const addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await addToCart(req.user.userId, productId, quantity);

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const cart = await getCart(req.user.userId);

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

const updateCartProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await updateCartItem(req.user.userId, productId, quantity);

    res.status(200).json({
      message: "Cart item updated",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await removeCartItem(req.user.userId, productId);

    res.status(200).json({
      message: "Cart item removed",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProductToCart,
  getUserCart,
  updateCartProduct,
  removeProductFromCart,
};