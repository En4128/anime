import { StatusCodes } from 'http-status-codes';
import { CommentRepository } from '../repositories/comment.repository.js';
import { ApiError } from '../utils/apiError.js';

export const CommentService = {
  createComment: (payload) => CommentRepository.create(payload),
  updateComment: async (id, payload, userId) => {
    const existing = await CommentRepository.findById(id);
    if (!existing) throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found');
    if (existing.user.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot edit others comments');
    }
    return CommentRepository.update(id, payload);
  },
  deleteComment: async (id, userId, isAdmin = false) => {
    const existing = await CommentRepository.remove(id);
    if (!existing) throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found');
    if (!isAdmin && existing.user.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot delete others comments');
    }
    return existing;
  },
  listAnimeComments: (animeId) => CommentRepository.listByAnime(animeId),
  toggleLike: (commentId, userId) => CommentRepository.toggleLike(commentId, userId),
};

