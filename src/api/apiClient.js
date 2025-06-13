import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Add interceptor once here, outside stores
apiClient.interceptors.request.use(config => {
  console.log(localStorage.getItem('token')); // should print a valid JWT

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
