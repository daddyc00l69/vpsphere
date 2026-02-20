import apiClient from './core';

export const projectsApi = {
    list: async () => {
        const { data } = await apiClient.get('/project/list');
        return data;
    },

    start: async (projectId: string) => {
        const { data } = await apiClient.post('/project/start', { projectId });
        return data;
    },

    stop: async (projectId: string) => {
        const { data } = await apiClient.post('/project/stop', { projectId });
        return data;
    },

    delete: async (projectId: string) => {
        const { data } = await apiClient.post('/project/delete', { projectId });
        return data;
    }
};
