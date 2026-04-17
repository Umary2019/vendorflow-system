const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', results: users.length, users });
});

const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['buyer', 'seller', 'admin'].includes(role)) {
    throw new AppError('Invalid role.', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.role = role;
  if (role === 'seller' && user.status === 'active') {
    user.status = 'pending';
  }
  await user.save();

  res.status(200).json({ status: 'success', user });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'pending', 'blocked'].includes(status)) {
    throw new AppError('Invalid status.', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  res.status(200).json({ status: 'success', user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await Promise.all([
    Product.deleteMany({ sellerId: user._id }),
    Cart.deleteMany({ userId: user._id }),
    User.findByIdAndDelete(user._id),
  ]);

  res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
});

module.exports = { getUsers, updateRole, updateStatus, deleteUser };
