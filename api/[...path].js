const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');

module.exports = async (req, res) => {
  try {
    console.log('API handler called:', req.method, req.url);
    
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI environment variable not set!');
      return res.status(500).json({ error: 'Missing MONGO_URI environment variable' });
    }
    
    await connectDB();
    console.log('Database connected successfully');
    
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    return res.status(500).json({ error: error.message });
  }
};
