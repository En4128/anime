import apiClient from './client.js';

export const authApi = {
  register: (payload) => apiClient.post('/auth/register', payload),
  login: (payload) => apiClient.post('/auth/login', payload),
  profile: () => apiClient.get('/auth/profile'),
};

