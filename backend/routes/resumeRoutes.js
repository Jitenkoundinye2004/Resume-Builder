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

// Public route - MUST be before other :resumeId routes to ensure it's matched first
// No authentication required
resumeRouter.get('/public/:resumeId', (req, res, next) => {
  console.log('=== PUBLIC ROUTE HIT ===');
  console.log('Resume ID param:', req.params.resumeId);
  console.log('Request path:', req.path);
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request originalUrl:', req.originalUrl);
  next();
}, getPublicResumeById);

resumeRouter.post('/create', protect, createResume);
// resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);

resumeRouter.get('/public/:resumeId/', (req, res, next) => {
  console.log('=== PUBLIC ROUTE HIT (with trailing slash) ===');
  console.log('Resume ID param:', req.params.resumeId);
  console.log('Request path:', req.path);
  next();
}, getPublicResumeById);

export default resumeRouter;