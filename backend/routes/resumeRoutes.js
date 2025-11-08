import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controllers/resumeController.js';
import upload from '../configs/mulder.js';

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
// resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
// Public route - no authentication required
// Handle both with and without trailing slash
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.get('/public/:resumeId/', getPublicResumeById);
// Test endpoint to verify routing
resumeRouter.get('/test', (req, res) => {
  res.json({ message: 'Resume routes are working', timestamp: new Date().toISOString() });
});

export default resumeRouter;