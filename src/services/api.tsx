import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {tokenStorage} from './storage'; // MMKV token storage module

// Define API base URL
const BASE_URL = 'http://ajeek.qbscocloud.net:31112';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh tokens
// Function to refresh tokens with enhanced logging
const refreshAuthToken = async (): Promise<boolean> => {
  const refreshToken = tokenStorage.getRefreshToken();
  const accessToken = tokenStorage.getToken();

  if (!refreshToken || !accessToken) {
    return false;
  }

  const response = await axios.post(
    `${BASE_URL}/Auth/IAuthFeature/RefreshToken`,
    {accessToken, refreshToken},
    {headers: {'Content-Type': 'application/json'}},
  );

  // Check for the response structure with nested data property
  if (response.status === 200 && response.data && response.data.data) {
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
      response.data.data;

    if (newAccessToken && newRefreshToken) {
      tokenStorage.saveToken(newAccessToken);
      tokenStorage.saveRefreshToken(newRefreshToken);
      return true;
    }
  }

  return false;
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      const refreshed = await refreshAuthToken();

      if (refreshed) {
        const newToken = tokenStorage.getToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // Retry the original request
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
