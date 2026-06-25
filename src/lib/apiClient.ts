import axios, { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';
export const TOKEN_KEY = 'landed.jwt';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8_000
});

apiClient.interceptors.request.use((config) => {
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
    const message =
      apiMessage ??
      (status === 403
        ? 'You do not have permission to perform this action.'
        : status === 500
          ? 'The server hit an unexpected error. Please try again.'
          : error.message);

    return Promise.reject(new Error(message));
  }
);
