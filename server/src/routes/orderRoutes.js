const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/all', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
