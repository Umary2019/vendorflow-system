const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedClientOrigins = new Set(
  [process.env.CLIENT_URL].filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedClientOrigins.has(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return isLocalHost && url.protocol === 'http:';
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
