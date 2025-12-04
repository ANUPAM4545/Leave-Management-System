// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Helper to attach JWT token to requests.
 * This ensures all protected endpoints receive the 'Authorization' header.
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

/**
 * Centralized API Client
 * 
 * All backend communication happens here. This makes it easy to:
 * - Manage endpoints in one place.
 * - Handle errors consistently.
 * - Mock API calls for testing.
 */
export const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },
    register: async (data) => {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },
    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me/`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },
    // Leaves
    getLeaves: async () => {
        const response = await fetch(`${API_URL}/leaves/`, { headers: getAuthHeaders() });
        return response.json();
    },
    createLeave: async (data) => {
        const response = await fetch(`${API_URL}/leaves/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create leave');
        return response.json();
    },
    // Manager
    getManagerQueue: async (status = 'PENDING') => {
        const query = status === 'ALL' ? '?all=true' : `?status=${status}`;
        const response = await fetch(`${API_URL}/manager-queue/${query}`, { headers: getAuthHeaders() });
        return response.json();
    },
    getManagerStats: async () => {
        const response = await fetch(`${API_URL}/manager-stats/`, { headers: getAuthHeaders() });
        return response.json();
    },
    actionLeave: async (id, action, comment) => {
        const response = await fetch(`${API_URL}/leaves/${id}/action/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ action, comment })
        });
        if (!response.ok) throw new Error('Action failed');
        return response.json();
    },
    // HR
    getHRSummary: async () => {
        const response = await fetch(`${API_URL}/hr-summary/`, { headers: getAuthHeaders() });
        return response.json();
    },
    getLeaveTypes: async () => {
        const response = await fetch(`${API_URL}/leave-types/`, { headers: getAuthHeaders() });
        return response.json();
    }
};
