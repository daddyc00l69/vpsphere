import core, { API_BASE_URL } from './core';
import { authApi } from './auth';
import { projectsApi } from './projects';
import { deploymentsApi } from './deployments';

export { core, API_BASE_URL, authApi, projectsApi, deploymentsApi };

// Also default export an aggregator for convenience
const api = {
    core: core,
    auth: authApi,
    projects: projectsApi,
    deployments: deploymentsApi
};

export default api;
