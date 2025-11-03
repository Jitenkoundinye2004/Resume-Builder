import express from 'express';
import { getUserById, getUserResume, loginUser, registerUser } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';


const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/data', protect, getUserById);
userRoutes.get('/resume', protect, getUserResume);

export default userRoutes;