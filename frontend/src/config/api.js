import axios from 'axios';

// Determine base URL - use environment variable or fallback to backend URL
const baseURL = import.meta.env.VITE_BASE_URL || "https://resume-builder-backend-aspa.onrender.com";

console.log('API Base URL configured:', baseURL);
console.log('VITE_BASE_URL from env:', import.meta.env.VITE_BASE_URL);

const API = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
