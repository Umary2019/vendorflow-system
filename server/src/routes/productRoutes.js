const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
} = require('../controllers/productController');
const { protect, optionalProtect, restrictTo, requireActiveAccount } = require('../middleware/authMiddleware');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

router.get('/', optionalProtect, getProducts);
router.get('/:id', optionalProtect, getProduct);
router.post('/', protect, restrictTo('seller'), requireActiveAccount, upload.single('imageFile'), createProduct);
router.patch('/:id', protect, restrictTo('seller'), requireActiveAccount, upload.single('imageFile'), updateProduct);
router.delete('/:id', protect, restrictTo('seller'), requireActiveAccount, deleteProduct);
router.patch('/:id/approve', protect, restrictTo('admin'), approveProduct);

module.exports = router;
