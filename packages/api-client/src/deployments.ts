import apiClient from './core';

export const deploymentsApi = {
    deploy: async (repoUrl: string) => {
        const { data } = await apiClient.post('/deploy', { repoUrl });
        return data;
    }
};
