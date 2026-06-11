import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/user.repository.js';
import { successResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { WatchlistService } from '../services/watchlist.service.js';

export const updateProfile = async (req, res) => {
  const updates = (({ username, bio, avatar, banner }) => ({
    username,
    bio,
    avatar,
    banner,
  }))(req.body);
  const user = await UserRepository.updateById(req.user.id, updates);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return successResponse(res, { message: 'Profile updated', data: user.toPublic() });
};

export const getWatchlist = async (req, res) => {
  const user = await UserRepository.findById(req.user.id).populate('watchlist');
  return successResponse(res, { data: user.watchlist });
};

export const toggleWatchlist = async (req, res) => {
  const watchlist = await WatchlistService.toggleWatchlist(req.user.id, req.body.animeId);
  return successResponse(res, { message: 'Watchlist updated', data: watchlist });
};

export const saveProgress = async (req, res) => {
  const updated = await WatchlistService.saveProgress(req.user.id, req.body);
  return successResponse(res, { message: 'Progress saved', data: updated.continueWatching });
};

