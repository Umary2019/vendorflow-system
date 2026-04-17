const express = require('express');
const { getUsers, updateRole, updateStatus, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.get('/', getUsers);
router.patch('/:id/role', updateRole);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteUser);

module.exports = router;
