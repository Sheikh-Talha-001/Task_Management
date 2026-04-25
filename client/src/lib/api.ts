import axios from 'axios';

// Create an Axios instance with the base URL of the Express backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-error')); // Custom event to trigger logout in App.tsx
    }
    return Promise.reject(error);
  }
);

export default api;
