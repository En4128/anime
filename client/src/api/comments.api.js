import apiClient from './client.js';

export const commentsApi = {
  list: (animeId) => apiClient.get(`/comments/anime/${animeId}`),
  create: (animeId, payload) => apiClient.post(`/comments/anime/${animeId}`, payload),
  remove: (commentId) => apiClient.delete(`/comments/${commentId}`),
  like: (commentId) => apiClient.post(`/comments/${commentId}/like`),
};

