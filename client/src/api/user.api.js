import apiClient from './client.js';

export const userApi = {
  updateProfile: (payload) => apiClient.patch('/users/profile', payload),
  getWatchlist: () => apiClient.get('/users/watchlist'),
  toggleWatchlist: (animeId) => apiClient.post('/users/watchlist', { animeId }),
  saveProgress: (payload) => apiClient.post('/users/progress', payload),
};

