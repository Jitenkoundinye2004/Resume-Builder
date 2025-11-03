import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiLimiter } from './middlewares/rateLimit.js';
import helmet from 'helmet';
import compression from 'compression';
// import imageKit from './configs/imageKit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err?.message || err);
  if (typeof server !== 'undefined' && server && server.close) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});


//DB Connection
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware for better performance
app.use(compression());

// Rate limiting
app.use('/api/', apiLimiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || false
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Request timeout
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// Serve static files from the frontend dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

//first route home route
app.get('/', (req, res) =>
res.send('Server is running'));

app.use('/api/users',userRoutes);

app.use('/api/resumes', resumeRouter);
app.use('/api/ai',aiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all handler: send back index.html for any non-API routes
// This must be placed AFTER all API routes to avoid conflicts
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});



// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


