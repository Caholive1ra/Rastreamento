import axios from 'axios';
import { WorkSession, Stats, StartSessionRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://programa-de-rastreamento.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ Auth Helpers ============

export interface AuthUser {
    username: string;
    role: 'ADMIN' | 'CLIENT';
}

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

/**
 * Get user role from localStorage
 */
export const getUserRole = (): string | null => {
    return localStorage.getItem('role');
};

/**
 * Save auth data to localStorage
 */
export const setAuthData = (token: string, role: string): void => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('role', role);
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

/**
 * Create Base64 encoded Basic Auth token
 */
export const createBasicAuthToken = (username: string, password: string): string => {
    return btoa(`${username}:${password}`);
};

// ============ Request Interceptor ============

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Basic ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ Response Interceptor ============

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthData();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============ Auth API ============

export const authApi = {
    /**
     * Login with username and password
     * Returns user info if successful
     */
    login: async (username: string, password: string): Promise<AuthUser> => {
        const token = createBasicAuthToken(username, password);
        const response = await axios.get<AuthUser>(`${API_BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Basic ${token}`,
            },
        });
        // Save auth data on successful login
        setAuthData(token, response.data.role);
        return response.data;
    },

    /**
     * Logout - clear stored auth
     */
    logout: (): void => {
        clearAuthData();
        window.location.href = '/login';
    },
};

// ============ Session API ============

export const sessionApi = {
    /**
     * Get all sessions (history)
     */
    getAllSessions: async (): Promise<WorkSession[]> => {
        const response = await api.get<WorkSession[]>('/sessions');
        return response.data;
    },

    /**
     * Get the current active session (if any)
     * Returns null if no active session
     */
    getActiveSession: async (): Promise<WorkSession | null> => {
        try {
            const response = await api.get<WorkSession>('/sessions/active');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 204) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Start a new timer session
     */
    startSession: async (description: string): Promise<WorkSession> => {
        const request: StartSessionRequest = { description };
        const response = await api.post<WorkSession>('/sessions/start', request);
        return response.data;
    },

    /**
     * Stop the current active session
     */
    stopSession: async (): Promise<WorkSession> => {
        const response = await api.post<WorkSession>('/sessions/stop');
        return response.data;
    },

    /**
     * Get statistics (total hours worked)
     */
    getStats: async (): Promise<Stats> => {
        const response = await api.get<Stats>('/sessions/stats');
        return response.data;
    },
};

export default api;
