const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');

const resolvePath = (req) => {
  const queryPath = typeof req.query?.path === 'string' ? req.query.path : '';

  if (queryPath) {
    return queryPath;
  }

  const urlPath = typeof req.url === 'string' ? req.url : '';
  const match = urlPath.match(/^\/api\/?(.*)$/);

  return match ? match[1] : '';
};

module.exports = async (req, res) => {
  try {
    const rawPath = resolvePath(req).replace(/^\/+/, '');
    const normalizedPath = rawPath ? `/${rawPath}` : '';

    req.url = normalizedPath ? `/api${normalizedPath}` : '/api';

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API handler error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
