import axios, { AxiosInstance } from 'axios';
import { pythonServiceConfig } from '../../config/python-service';

/**
 * Pre-configured Axios HTTP client for communicating with the Python/FastAPI geometry & AI service.
 */
export const pythonHttpClient: AxiosInstance = axios.create({
  baseURL: pythonServiceConfig.baseUrl,
  timeout: pythonServiceConfig.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'STRATA-NodeBackend/1.0',
  },
});

// Interceptor for outgoing requests
pythonHttpClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor for incoming responses
pythonHttpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
