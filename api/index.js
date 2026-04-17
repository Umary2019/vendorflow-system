const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');

module.exports = async (req, res) => {
  try {
    const rawPath = typeof req.query?.path === 'string' ? req.query.path : '';
    const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

    req.url = `/api${normalizedPath}`;

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API handler error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};