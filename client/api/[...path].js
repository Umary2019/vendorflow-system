const resolvePath = (req) => {
  const queryPath = typeof req.query?.path === 'string' ? req.query.path : '';

  if (queryPath) {
    return queryPath;
  }

  const urlPath = typeof req.url === 'string' ? req.url : '';
  const match = urlPath.match(/^\/api\/?(.*)$/);

  return match ? match[1] : '';
};

export default async function handler(req, res) {
  try {
    const rawPath = resolvePath(req).replace(/^\/+/, '');
    const normalizedPath = rawPath ? `/${rawPath}` : '';

    req.url = normalizedPath ? `/api${normalizedPath}` : '/api';

    if (req.url === '/api/health') {
      return res.status(200).json({
        status: 'ok',
        runtime: 'vercel',
        hasMongoUri: Boolean(process.env.MONGO_URI),
        hasJwtSecret: Boolean(process.env.JWT_SECRET),
      });
    }

    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Missing required server environment variables (MONGO_URI and/or JWT_SECRET).',
      });
    }

    const [{ default: app }, { default: connectDB }] = await Promise.all([
      import('../../server/src/app.js'),
      import('../../server/src/config/db.js'),
    ]);

    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({
        message: 'Database connection failed. Verify MONGO_URI and Atlas network access.',
      });
    }

    return app(req, res);
  } catch (error) {
    const missingBackendCode = error?.code === 'ERR_MODULE_NOT_FOUND';

    if (missingBackendCode) {
      return res.status(500).json({
        message: 'Backend code is not available in this deployment root. Deploy from repository root or set VITE_API_URL to a separate backend URL.',
      });
    }

    console.error('API handler error:', error);
    return res.status(500).json({ message: 'Server error', detail: error.message });
  }
}