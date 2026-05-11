import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/api';
import { getToken, clearAuth } from '../utils/storage';

// Sử dụng callback đơn giản để tránh circular dependency
let onUnauthorized: (() => void) | null = null;

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json',
    },
});

// ── Request interceptor ──────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();

        // Nếu trong config chưa có sẵn Authorization (ưu tiên manual token)
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            await clearAuth();
            if (onUnauthorized) {
                onUnauthorized();
            }
        }
        return Promise.reject(error);
    },
);

export const setAuthErrorCallback = (cb: () => void) => {
    onUnauthorized = cb;
};

export default axiosClient;
