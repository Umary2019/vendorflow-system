const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  if (isConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

module.exports = connectDB;
