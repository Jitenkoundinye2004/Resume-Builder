import axios from 'axios';

// Determine base URL - use environment variable or fallback to backend URL
// IMPORTANT: Vite replaces import.meta.env at build time, so we need to handle undefined
const getBaseURL = () => {
  // Try to get from environment variable (set at build time)
  const envURL = import.meta.env.VITE_BASE_URL;
  const fallbackURL = "https://resume-builder-backend-aspa.onrender.com";
  
  // Check if we're on the same domain (backend serves frontend)
  // If current host includes 'backend', use relative URLs
  const currentHost = window.location.hostname;
  if (currentHost.includes('resume-builder-backend') || currentHost.includes('localhost')) {
    // Same server - use relative URLs
    return '';
  }
  
  // Separate frontend deployment - need absolute URL
  // Check if env URL exists and is not empty
  if (envURL && typeof envURL === 'string' && envURL.trim() !== '' && envURL !== 'undefined') {
    return envURL;
  }
  
  // Use fallback
  return fallbackURL;
};

const baseURL = getBaseURL();

console.log('=== API Configuration ===');
console.log('Current hostname:', window.location.hostname);
console.log('VITE_BASE_URL from env:', import.meta.env.VITE_BASE_URL);
console.log('Final API Base URL:', baseURL || '(relative - same server)');
console.log('========================');

const API = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token and logging
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure baseURL is always set correctly
    if (!config.baseURL || config.baseURL === 'undefined' || config.baseURL.trim() === '') {
      config.baseURL = 'https://resume-builder-backend-aspa.onrender.com';
      console.warn('⚠️ baseURL was invalid, using fallback:', config.baseURL);
    }
    
    // Log the actual request being made
    const fullUrl = config.baseURL + config.url;
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: fullUrl,
      headers: config.headers
    });
    
    // Verify the URL is going to the backend, not frontend
    if (fullUrl.includes('resume-builder-frontend')) {
      console.error('❌ ERROR: Request is going to frontend instead of backend!');
      console.error('Fixing URL...');
      config.baseURL = 'https://resume-builder-backend-aspa.onrender.com';
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
