const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
