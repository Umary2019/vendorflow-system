const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

  res.status(200).json({
    status: 'success',
    cart: cart || { userId: req.user._id, items: [] },
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new AppError('Product id is required.', 400);
  }

  const product = await Product.findById(productId);
  if (!product || !product.approved) {
    throw new AppError('Product is unavailable.', 404);
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $setOnInsert: { userId: req.user._id, items: [] } },
    { new: true, upsert: true }
  );

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ productId, quantity: Number(quantity) });
  }

  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({ status: 'success', cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({ status: 'success', cart });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }, { upsert: true });

  res.status(200).json({ status: 'success', message: 'Cart cleared.' });
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };
