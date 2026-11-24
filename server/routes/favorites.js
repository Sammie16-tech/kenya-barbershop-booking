const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.post('/toggle', protect, favoriteController.toggleFavorite);
router.get('/', protect, favoriteController.getFavorites);

module.exports = router;
