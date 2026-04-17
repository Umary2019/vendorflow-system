module.exports = async (req, res) => {
  try {
    console.log('🟢 API handler called:', req.method, req.url);
    console.log('🔵 Environment check:');
    console.log('  MONGO_URI exists:', !!process.env.MONGO_URI);
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    
    // Test response
    if (req.url === '/api/health' && req.method === 'GET') {
      return res.status(200).json({ status: 'ok', message: 'Serverless function is running' });
    }

    // Try to require app if env is set
    if (!process.env.MONGO_URI) {
      return res.status(500).json({ 
        error: 'MONGO_URI not configured on Vercel',
        hint: 'Go to Project Settings > Environment Variables and add MONGO_URI'
      });
    }

    const app = require('../server/src/app');
    const connectDB = require('../server/src/config/db');
    
    console.log('🟡 Connecting to database...');
    await connectDB();
    console.log('🟢 Database connected');
    
    return app(req, res);
  } catch (error) {
    console.error('🔴 Serverless handler error:', error.message);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
};
