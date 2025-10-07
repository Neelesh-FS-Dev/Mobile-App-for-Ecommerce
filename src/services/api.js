import axios from 'axios';
import { storage, STORAGE_KEYS } from './storage';

// Replace with your machine's local IP address
const API_BASE_URL = 'https://c168a0547bf7.ngrok-free.app/api'; // <-- Replace 192.168.X.X

const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: false, // only needed for cookies
});

// Add token to requests
api.interceptors.request.use(
  async config => {
    try {
      const token = await storage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// Handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired, invalid, or forbidden
      await storage.removeItem(STORAGE_KEYS.TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER);
      console.log('Token invalid or expired. User logged out.');
      // You can navigate to login screen here
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    console.log(name, email, password) ||
    api.post('/auth/register/', { name, email, password }),
};

export const productsAPI = {
  getAll: (category = '', search = '') =>
    api.get(`/products?category=${category}&search=${search}`),
  getById: id => api.get(`/products/${id}`),
};

export const ordersAPI = {
  create: orderData => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: id => api.get(`/orders/${id}`),
};

export { storage, STORAGE_KEYS };
export default api;
