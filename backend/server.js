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
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://resume-builder-frontend-3y6h.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
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


// Logging middleware - moved before routes to log all requests
app.use((req, res, next) => {
  console.log('=== REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Accept:', req.headers.accept);
  console.log('================');
  next();
});

// first route home route
app.get('/', (req, res) => res.send('Server is running'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle CORS preflight requests for all API routes
app.options(/^\/api\/.*/, (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// api routes - MUST be before static files middleware
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

// Log registered routes for debugging
console.log('=== REGISTERED ROUTES ===');
console.log('API Routes registered:');
console.log('  - /api/users');
console.log('  - /api/resumes');
console.log('  - /api/ai');
console.log('Resume routes should include:');
console.log('  - GET /api/resumes/test');
console.log('  - GET /api/resumes/public/:resumeId');
console.log('========================');

// Serve static files from the frontend dist directory
// This must come before the SPA fallback
const staticPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticPath, {
  // Don't serve index.html for static file requests
  index: false,
  // Set proper cache headers for static assets
  maxAge: '1y'
}));

// SPA fallback - serve index.html for all non-API, non-file GET requests
// This handles page reloads and direct URL access (e.g., /view/123, /app/builder/123)
app.get(/^(?!\/api).*/, (req, res, next) => {
  // Skip if it's a file request (has extension like .js, .css, .png, .jpg, etc.)
  const ext = path.extname(req.path);
  if (ext && ext !== '.html') {
    return next(); // Let 404 handler deal with missing static files
  }
  
  // Serve index.html for all other GET requests (SPA routes)
  const indexPath = path.join(staticPath, 'index.html');
  console.log('Serving SPA index.html for path:', req.path);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err.message);
      // If index.html doesn't exist, pass to 404 handler
      if (err.code === 'ENOENT') {
        return next();
      }
      next(err);
    }
  });
});

// 404 handler for API routes only (must be last)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    console.log('404 - API route not found:', req.method, req.path);
    res.status(404).json({ 
      message: 'API endpoint not found', 
      path: req.path,
      method: req.method
    });
  } else {
    // This should rarely be hit due to SPA fallback above
    console.log('404 - Non-API route not found:', req.method, req.path);
    res.status(404).send('Not Found');
  }
});


// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



