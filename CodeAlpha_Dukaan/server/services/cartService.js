const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString(),
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock");
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  await cart.populate("items.product");

  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return {
      user: userId,
      items: [],
    };
  }

  return cart;
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error("Requested quantity exceeds available stock");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString(),
  );

  if (!item) {
    throw new Error("Product is not in the cart");
  }

  item.quantity = quantity;

  await cart.save();

  await cart.populate("items.product");

  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString(),
  );

  if (!item) {
    throw new Error("Product is not in the cart");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString(),
  );

  await cart.save();

  await cart.populate("items.product");

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
