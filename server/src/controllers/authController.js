const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendAuthResponse = (user, res) => {
  const token = signToken(user._id);
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };

  res.status(200).json({
    status: 'success',
    token,
    user: safeUser,
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, password, role = 'buyer' } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400);
  }

  if (!['buyer', 'seller'].includes(role)) {
    throw new AppError('Invalid registration role.', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already in use.', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: role === 'seller' ? 'pending' : 'active',
  });

  await Cart.create({ userId: user._id, items: [] });
  sendAuthResponse(user, res);
});

const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.status === 'blocked') {
    throw new AppError('Your account has been blocked.', 403);
  }

  sendAuthResponse(user, res);
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = { register, login, me };