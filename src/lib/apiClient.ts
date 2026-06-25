import axios, { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';
export const TOKEN_KEY = 'landed.jwt';
const REQUEST_TIMEOUT_MS = 30_000;
const isProductionMissingApiUrl = import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: REQUEST_TIMEOUT_MS
});

apiClient.interceptors.request.use((config) => {
  if (isProductionMissingApiUrl) {
    throw new Error('Backend API URL is not configured. Set VITE_API_BASE_URL in Vercel to your live backend URL.');
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('landed.user');
    }

    const fieldErrors = error.response?.data?.fieldErrors;
    const firstFieldError = fieldErrors ? Object.values(fieldErrors)[0] : undefined;
    const apiMessage = firstFieldError ?? error.response?.data?.message;
    const timeoutMessage =
      error.code === 'ECONNABORTED' || error.message.includes('timeout')
        ? 'The backend API did not respond in time. Check that VITE_API_BASE_URL points to a live backend and that the backend database is awake.'
        : undefined;
    const networkMessage =
      error.message === 'Network Error'
        ? 'Could not reach the backend API. Check VITE_API_BASE_URL and backend CORS settings.'
        : undefined;
    const message =
      apiMessage ??
      timeoutMessage ??
      networkMessage ??
      (status === 403
        ? 'You do not have permission to perform this action.'
        : status === 500
          ? 'The server hit an unexpected error. Please try again.'
          : error.message);

    return Promise.reject(new Error(message));
  }
);
