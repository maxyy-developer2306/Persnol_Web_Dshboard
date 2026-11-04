import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const isDev = !API_URL;

const api = axios.create({
  baseURL: isDev ? '/api' : `${API_URL.replace(/\/$/, '')}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;