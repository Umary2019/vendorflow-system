const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in.', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('+password');

  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  if (user.status === 'blocked') {
    throw new AppError('Your account is blocked.', 403);
  }

  req.user = user;
  next();
});

const optionalProtect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return next();
  }

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('+password');

  if (user && user.status !== 'blocked') {
    req.user = user;
  }

  next();
});

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }

  next();
};

const requireActiveAccount = (req, res, next) => {
  if (req.user.status !== 'active') {
    return next(new AppError('Your account is pending approval.', 403));
  }

  next();
};

module.exports = { protect, optionalProtect, restrictTo, requireActiveAccount };
