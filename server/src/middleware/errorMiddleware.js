const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = new AppError('Invalid resource id.', 400);
  }

  if (err.code === 11000) {
    error = new AppError('Duplicate field value.', 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join('. ');
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Something went wrong.',
  });
};

module.exports = { notFound, errorHandler };
