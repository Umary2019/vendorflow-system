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
const { protect, optionalProtect, restrictTo } = require('../middleware/authMiddleware');
const AppError = require('../utils/AppError');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });
const rejectFileUploadsOnServerless = (req, res, next) => {
  if (!process.env.VERCEL) {
    next();
    return;
  }

  if (req.file) {
    next(new AppError('Image file upload is not supported on Vercel serverless storage. Please use an image URL.', 400));
    return;
  }

  next();
};

router.get('/', optionalProtect, getProducts);
router.get('/:id', optionalProtect, getProduct);
router.post('/', protect, restrictTo('seller'), upload.single('imageFile'), rejectFileUploadsOnServerless, createProduct);
router.patch('/:id', protect, restrictTo('seller'), upload.single('imageFile'), rejectFileUploadsOnServerless, updateProduct);
router.delete('/:id', protect, restrictTo('seller'), deleteProduct);
router.patch('/:id/approve', protect, restrictTo('admin'), approveProduct);

module.exports = router;
