import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../services/comment.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const createComment = async (req, res) => {
  const comment = await CommentService.createComment({
    ...req.body,
    anime: req.params.animeId,
    user: req.user.id,
  });
  return successResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Comment posted',
    data: comment,
  });
};

export const listComments = async (req, res) => {
  const comments = await CommentService.listAnimeComments(req.params.animeId);
  return successResponse(res, { data: comments });
};

export const deleteComment = async (req, res) => {
  await CommentService.deleteComment(req.params.commentId, req.user.id, req.user.role === 'admin');
  return successResponse(res, { message: 'Comment removed' });
};

export const updateComment = async (req, res) => {
  const comment = await CommentService.updateComment(req.params.commentId, req.body, req.user.id);
  return successResponse(res, { message: 'Comment updated', data: comment });
};

export const toggleLike = async (req, res) => {
  const comment = await CommentService.toggleLike(req.params.commentId, req.user.id);
  return successResponse(res, { data: comment });
};

