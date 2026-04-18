const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getProducts = asyncHandler(async (req, res) => {
  const { search = '', category = '', mine = 'false', sellerId } = req.query;
  const filter = {};

  if (mine === 'true' && req.user && req.user.role === 'seller') {
    filter.sellerId = req.user._id;
  } else if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (req.user?.role !== 'admin' && mine !== 'true') {
    filter.approved = true;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter)
    .populate('sellerId', 'name email role status')
    .sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', results: products.length, products });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('sellerId', 'name email role status');

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  const isOwner = req.user && product.sellerId._id.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';

  if (!product.approved && !isOwner && !isAdmin) {
    throw new AppError('Product not found.', 404);
  }

  res.status(200).json({ status: 'success', product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  const resolvedImage = req.file ? `/uploads/${req.file.filename}` : image;

  if (!resolvedImage) {
    throw new AppError('Product image is required.', 400);
  }

  const product = await Product.create({
    name,
    price,
    description,
    image: resolvedImage,
    category,
    stock,
    sellerId: req.user._id,
    approved: true,
  });

  res.status(201).json({ status: 'success', product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (product.sellerId.toString() !== req.user._id.toString()) {
    throw new AppError('You can only edit your own products.', 403);
  }

  const resolvedImage = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  const updatePayload = { ...req.body };

  if (resolvedImage) {
    updatePayload.image = resolvedImage;
  }

  if (updatePayload.price) {
    updatePayload.price = Number(updatePayload.price);
  }

  if (updatePayload.stock) {
    updatePayload.stock = Number(updatePayload.stock);
  }

  updatePayload.approved = true;

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', product: updatedProduct });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (product.sellerId.toString() !== req.user._id.toString()) {
    throw new AppError('You can only delete your own products.', 403);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ status: 'success', message: 'Product deleted successfully.' });
});

const approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true, runValidators: true }
  ).populate('sellerId', 'name email role status');

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  res.status(200).json({ status: 'success', product });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
};
