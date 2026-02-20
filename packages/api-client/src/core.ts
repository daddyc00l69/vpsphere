import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.devtushar.uk';

// Create the core axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // We execute this primarily in browsers, so we check for window
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('vpsphere_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global error unwrapping (handle 401s, 403s, etc seamlessly)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vpsphere_token');
                // We'll rely on our React context to push navigation based on the token disappearance,
                // or trigger a global custom event
                window.dispatchEvent(new CustomEvent('vpsphere_unauthorized'));
            }
        }

        // Normalize errors so UI components don't have to parse deep axios structures
        const customError = new Error(
            error.response?.data?.error || error.response?.data?.message || error.message || 'An unknown network error occurred'
        );
        (customError as any).status = error.response?.status;

        return Promise.reject(customError);
    }
);

export default apiClient;
