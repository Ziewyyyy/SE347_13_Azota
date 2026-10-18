const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { uploadAvatar } = require('../middlewares/upload.middleware');

router.post('/send-otp', authController.sendOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, uploadAvatar, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
