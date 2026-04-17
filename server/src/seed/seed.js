require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Cart.deleteMany(),
    Order.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@marketplace.com',
    password: 'Admin123!',
    role: 'admin',
    status: 'active',
  });

  const seller = await User.create({
    name: 'Ava Seller',
    email: 'seller@marketplace.com',
    password: 'Seller123!',
    role: 'seller',
    status: 'active',
  });

  const buyer = await User.create({
    name: 'Noah Buyer',
    email: 'buyer@marketplace.com',
    password: 'Buyer123!',
    role: 'buyer',
    status: 'active',
  });

  await Cart.create([
    { userId: admin._id, items: [] },
    { userId: seller._id, items: [] },
    { userId: buyer._id, items: [] },
  ]);

  await Product.insertMany([
    {
      name: 'Aurora Desk Lamp',
      price: 79,
      description: 'Minimal desk lamp with warm lighting and a clean anodized finish.',
      image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      category: 'Home Office',
      stock: 24,
      sellerId: seller._id,
      approved: true,
    },
    {
      name: 'Studio Wireless Headphones',
      price: 129,
      description: 'Closed-back wireless headphones built for deep focus and rich sound.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      category: 'Audio',
      stock: 15,
      sellerId: seller._id,
      approved: true,
    },
    {
      name: 'Everyday Travel Pack',
      price: 98,
      description: 'Lightweight premium backpack with smart compartments for daily carry.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      category: 'Accessories',
      stock: 30,
      sellerId: seller._id,
      approved: true,
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed completed successfully.');
  // eslint-disable-next-line no-console
  console.log('Admin: admin@marketplace.com / Admin123!');
  // eslint-disable-next-line no-console
  console.log('Seller: seller@marketplace.com / Seller123!');
  // eslint-disable-next-line no-console
  console.log('Buyer: buyer@marketplace.com / Buyer123!');

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
