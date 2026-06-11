import { UserRepository } from '../repositories/user.repository.js';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/apiError.js';

export const WatchlistService = {
  toggleWatchlist: async (userId, animeId) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    const already = user.watchlist.some((id) => id.toString() === animeId);
    const updated = already
      ? await UserRepository.removeFromWatchlist(userId, animeId)
      : await UserRepository.addToWatchlist(userId, animeId);
    return updated.watchlist;
  },
  saveProgress: async (userId, payload) => {
    const updated = await UserRepository.updateContinueWatching(userId, payload);
    return updated;
  },
};

