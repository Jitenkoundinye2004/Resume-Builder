import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true
}));

// SPA fallback - serve index.html for all routes
// This handles page reloads and direct URL access
app.get('*', (req, res, next) => {
  // Skip API routes (shouldn't happen on frontend server, but just in case)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found on frontend server' });
  }
  
  // Skip static file requests (files with extensions like .js, .css, .png, etc.)
  const ext = path.extname(req.path);
  if (ext && ext !== '.html') {
    return next(); // Let Express handle 404 for missing static files
  }
  
  // Serve index.html for all other routes (SPA routing)
  // This allows React Router to handle the routing
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      next(err);
    }
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
});

