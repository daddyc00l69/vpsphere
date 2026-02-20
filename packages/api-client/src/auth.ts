import apiClient from './core';

export const authApi = {
    login: async (credentials: any) => {
        const { data } = await apiClient.post('/auth/login', credentials);
        return data;
    },

    register: async (userData: any) => {
        const { data } = await apiClient.post('/auth/register', userData);
        return data;
    },

    // Future enhancements (e.g., getting current profile details if the endpoint exists)
    getProfile: async () => {
        const { data } = await apiClient.get('/auth/me');
        return data;
    }
};
