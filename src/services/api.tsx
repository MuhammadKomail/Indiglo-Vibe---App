import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {tokenStorage} from './storage';

// Base URLs (use same as before; update if chat/app backends differ)
export const CHAT_API_BASE_URL = 'http://192.168.1.123:3003';
export const APP_API_BASE_URL = 'http://192.168.1.105:3003';

// Create axios instances
export const chatApi: AxiosInstance = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

export const appApi: AxiosInstance = axios.create({
  baseURL: APP_API_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
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
    `${APP_API_BASE_URL}/Auth/IAuthFeature/RefreshToken`,
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

// Attach request interceptors to both instances
const onRequest = async (config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError) => Promise.reject(error);

chatApi.interceptors.request.use(onRequest, onRequestError);
appApi.interceptors.request.use(onRequest, onRequestError);

// Attach response interceptors to both instances
const onResponse = (response: AxiosResponse) => response;

const onResponseError = async (error: AxiosError) => {
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
        // Retry against the same base URL that failed originally
        const client =
          originalRequest.baseURL === CHAT_API_BASE_URL ? chatApi : appApi;
        return client(originalRequest);
      }
    }
  }

  return Promise.reject(error);
};

chatApi.interceptors.response.use(onResponse, onResponseError);
appApi.interceptors.response.use(onResponse, onResponseError);

// Keep default export for backward compatibility (points to appApi)
export default appApi;
