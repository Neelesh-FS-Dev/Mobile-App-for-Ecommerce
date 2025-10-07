import axios from 'axios';
import { storage, STORAGE_KEYS } from './storage';

// Replace with your machine's local IP address or ngrok URL
const API_BASE_URL = 'https://c168a0547bf7.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Log each request before sending
api.interceptors.request.use(
  async config => {
    try {
      const token = await storage.getItem(STORAGE_KEYS.TOKEN);
      console.log('[Token Retrieved]', token);
      console.log('[Request]', config.method?.toUpperCase(), config.url);
      console.log('[Request Data]', config.data);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[Auth Token Attached]', token);
      } else {
        console.log('[No Token Found]');
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  error => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  },
);

// Handle token expiration and log responses
api.interceptors.response.use(
  response => {
    console.log('[Response Success]', response.config.url, response.status);
    console.log('[Response Data]', response.data);
    return response;
  },
  async error => {
    console.error(
      '[Response Error]',
      error?.response?.status,
      error?.response?.data,
    );
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Token invalid or expired. Logging out user...');
      await storage.removeItem(STORAGE_KEYS.TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (email, password) => {
    console.log('[authAPI.login] email:', email);
    const res = await api.post('/auth/login', { email, password });
    console.log('[authAPI.login] response data:', res.data);
    return res;
  },
  register: async (name, email, password) => {
    console.log('[authAPI.register] data:', { name, email, password });
    const res = await api.post('/auth/register', { name, email, password });
    console.log('[authAPI.register] response data:', res.data);
    return res;
  },
};

export const productsAPI = {
  getAll: async (category = '', search = '') => {
    console.log('[productsAPI.getAll] category:', category, 'search:', search);
    const res = await api.get(
      `/products?category=${category}&search=${search}`,
    );
    console.log('[productsAPI.getAll] response data:', res.data);
    return res;
  },
  getById: async id => {
    console.log('[productsAPI.getById] id:', id);
    const res = await api.get(`/products/${id}`);
    console.log('[productsAPI.getById] response data:', res.data);
    return res;
  },
};

export const ordersAPI = {
  create: async orderData => {
    console.log('[ordersAPI.create] orderData:', orderData);
    const res = await api.post('/orders', orderData);
    console.log('[ordersAPI.create] response data:', res.data);
    return res;
  },
  getMyOrders: async () => {
    console.log('[ordersAPI.getMyOrders]');
    const res = await api.get('/orders/my-orders');
    console.log('[ordersAPI.getMyOrders] response data:', res.data);
    return res;
  },
  getById: async id => {
    console.log('[ordersAPI.getById] id:', id);
    const res = await api.get(`/orders/${id}`);
    console.log('[ordersAPI.getById] response data:', res.data);
    return res;
  },
};

export { storage, STORAGE_KEYS };
export default api;
