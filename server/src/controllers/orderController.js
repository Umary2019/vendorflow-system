const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty.', 400);
  }

  const orderProducts = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = item.productId;
    if (!product || !product.approved) {
      throw new AppError('One or more cart items are no longer available.', 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${product.name}.`, 400);
    }

    orderProducts.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    totalPrice += product.price * item.quantity;

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    userId: req.user._id,
    products: orderProducts,
    totalPrice,
    status: 'pending',
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ status: 'success', order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  if (req.user.role === 'seller') {
    const orders = await Order.find().populate('products.productId').sort({ createdAt: -1 });
    const sellerOrders = orders.filter((order) =>
      order.products.some((item) => item.productId && item.productId.sellerId.toString() === req.user._id.toString())
    );

    return res.status(200).json({ status: 'success', results: sellerOrders.length, orders: sellerOrders });
  }

  const orders = await Order.find({ userId: req.user._id }).populate('products.productId').sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: orders.length, orders });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('products.productId').populate('userId', 'name email role status').sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', results: orders.length, orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'delivered', 'cancelled'].includes(status)) {
    throw new AppError('Invalid order status.', 400);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('products.productId').populate('userId', 'name email role status');

  if (!order) {
    throw new AppError('Order not found.', 404);
  }

  res.status(200).json({ status: 'success', order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found.', 404);
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = order.userId.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new AppError('You do not have permission to delete this order.', 403);
  }

  if (!isAdmin && order.status === 'delivered') {
    throw new AppError('Delivered orders cannot be deleted.', 400);
  }

  if (order.status === 'pending') {
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }
  }

  await Order.findByIdAndDelete(order._id);

  res.status(200).json({ status: 'success', message: 'Order deleted successfully.' });
});

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };
