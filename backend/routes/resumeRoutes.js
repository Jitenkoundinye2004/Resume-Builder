import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controllers/resumeController.js';
import upload from '../configs/mulder.js';

const resumeRouter = express.Router();

// Test endpoint to verify routing (put first for easy testing)
resumeRouter.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Resume routes are working', timestamp: new Date().toISOString() });
});

resumeRouter.post('/create', protect, createResume);
// resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);

// Public route - no authentication required
// Handle both with and without trailing slash
resumeRouter.get('/public/:resumeId', (req, res, next) => {
  console.log('=== PUBLIC ROUTE HIT ===');
  console.log('Resume ID param:', req.params.resumeId);
  console.log('Request path:', req.path);
  next();
}, getPublicResumeById);

resumeRouter.get('/public/:resumeId/', (req, res, next) => {
  console.log('=== PUBLIC ROUTE HIT (with trailing slash) ===');
  console.log('Resume ID param:', req.params.resumeId);
  console.log('Request path:', req.path);
  next();
}, getPublicResumeById);

export default resumeRouter;