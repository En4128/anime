import { StatusCodes } from 'http-status-codes';
import { AnimeRepository } from '../repositories/anime.repository.js';
import { EpisodeRepository } from '../repositories/episode.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/apiError.js';
import { buildPagination } from '../utils/pagination.js';

const buildFilters = ({ genres, status, search }) => {
  const filter = {};
  if (genres) {
    filter.genres = { $in: Array.isArray(genres) ? genres : [genres] };
  }
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { synopsis: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export const AnimeService = {
  createAnime: async (payload) => AnimeRepository.create(payload),

  updateAnime: async (id, payload) => {
    const anime = await AnimeRepository.update(id, payload);
    if (!anime) throw new ApiError(StatusCodes.NOT_FOUND, 'Anime not found');
    return anime;
  },

  deleteAnime: async (id) => {
    const anime = await AnimeRepository.remove(id);
    if (!anime) throw new ApiError(StatusCodes.NOT_FOUND, 'Anime not found');
    return anime;
  },

  getAnimeBySlug: async (slug) => {
    const anime = await AnimeRepository.findBySlug(slug);
    if (!anime) throw new ApiError(StatusCodes.NOT_FOUND, 'Anime not found');
    return anime;
  },

  getAnimeById: async (id) => {
    const anime = await AnimeRepository.findById(id);
    if (!anime) throw new ApiError(StatusCodes.NOT_FOUND, 'Anime not found');
    return anime;
  },

  listAnime: async (query) => {
    const { page, limit, skip } = buildPagination(query);
    const filter = buildFilters(query);
    const sort = query.sort === 'recent' ? { createdAt: -1 } : { popularity: -1 };
    const [items, total] = await Promise.all([
      AnimeRepository.list(filter, { sort, limit, skip }),
      AnimeRepository.count(filter),
    ]);
    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  getHomepageSections: async () => {
    const [featured, trending, popular, recent] = await Promise.all([
      AnimeRepository.list({ featured: true }, { limit: 5, sort: { updatedAt: -1 } }),
      AnimeRepository.list({}, { limit: 10, sort: { trendingScore: -1 } }),
      AnimeRepository.list({}, { limit: 10, sort: { popularity: -1 } }),
      AnimeRepository.list({}, { limit: 10, sort: { createdAt: -1 } }),
    ]);
    return { featured, trending, popular, recent };
  },

  upsertEpisode: async (animeId, payload) => {
    if (payload.id) {
      const updated = await EpisodeRepository.update(payload.id, payload);
      if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Episode not found');
      return updated;
    }
    return EpisodeRepository.create({ ...payload, anime: animeId });
  },

  deleteEpisode: async (episodeId) => {
    const deleted = await EpisodeRepository.remove(episodeId);
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, 'Episode not found');
    return deleted;
  },

  listEpisodes: (animeId) => EpisodeRepository.listByAnime(animeId),

  toggleLike: async (animeId, user) => {
    const anime = await AnimeRepository.findById(animeId);
    if (!anime) throw new ApiError(StatusCodes.NOT_FOUND, 'Anime not found');
    const userDoc = await UserRepository.findById(user.id);
    const hasLiked = userDoc?.likedAnime?.some((id) => id.toString() === animeId.toString());
    if (hasLiked) {
      await UserRepository.unlikeAnime(user.id, animeId);
      await AnimeRepository.like(animeId, -1);
      return { liked: false };
    }
    await UserRepository.likeAnime(user.id, animeId);
    await AnimeRepository.like(animeId, 1);
    return { liked: true };
  },
};

