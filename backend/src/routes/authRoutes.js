import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../utils/validators.js';
import validate from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;