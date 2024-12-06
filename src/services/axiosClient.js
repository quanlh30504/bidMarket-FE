import axios from 'axios';
import { authService } from '../router/index.js';

const getAccessToken = () => localStorage.getItem(authService.tokenKey);

// Axios instance
const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// try get new access token when the old one is expired
axiosClient.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  // 401 (Unauthorized) and not retry yet
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // mark as retry
    try {
      const accessToken = await authService.refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

      return axiosClient(originalRequest);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      if (refreshError.response === "Invalid refresh token") {
        authService.logout();
      }
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default axiosClient;
