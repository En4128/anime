import apiClient from './client.js';

export const animeApi = {
  homepage: () => apiClient.get('/anime/home'),
  list: (params) => apiClient.get('/anime', { params }),
  getBySlug: (slug) => apiClient.get(`/anime/${slug}`),
  getById: (id) => apiClient.get(`/anime/id/${id}`),
  create: (payload) => apiClient.post('/anime', payload),
  update: (id, payload) => apiClient.patch(`/anime/${id}`, payload),
  remove: (id) => apiClient.delete(`/anime/${id}`),
  upsertEpisode: (animeId, payload) => apiClient.post(`/anime/${animeId}/episodes`, payload),
  deleteEpisode: (animeId, episodeId) => apiClient.delete(`/anime/${animeId}/episodes/${episodeId}`),
  like: (id) => apiClient.post(`/anime/${id}/like`),
};

