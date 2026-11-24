const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', authorize('admin', 'shop_owner'), adminController.getDashboardStats);
router.get('/revenue', authorize('admin', 'shop_owner'), adminController.getRevenueAnalytics);
router.post('/shops', adminController.createShop);
router.post('/promote', authorize('shop_owner'), adminController.promoteShop);



module.exports = router;
