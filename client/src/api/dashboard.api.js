import apiClient from './client.js';

export const dashboardApi = {
  stats: () => apiClient.get('/dashboard'),
};

