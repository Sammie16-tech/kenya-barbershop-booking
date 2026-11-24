const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});
router.put('/profile', protect, authController.updateProfile);
router.post('/profile-picture', protect, upload.single('image'), authController.uploadProfilePicture);

module.exports = router;
