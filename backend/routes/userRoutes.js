import express from 'express';
import { getUserById, getUserResume, loginUser, registerUser, forgotPassword, resetPassword } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import { authLimiter, registerLimiter } from '../middlewares/rateLimit.js';

const userRoutes = express.Router();

// Apply stricter rate limiting to auth routes
userRoutes.post('/register', registerLimiter, registerUser);
userRoutes.post('/login', authLimiter, loginUser);
userRoutes.post('/forgot-password', authLimiter, forgotPassword);
userRoutes.post('/reset-password/:token', resetPassword);
userRoutes.get('/data', protect, getUserById);
userRoutes.get('/resume', protect, getUserResume);

export default userRoutes;
