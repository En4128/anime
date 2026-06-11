import { StatusCodes } from 'http-status-codes';
import { AnimeService } from '../services/anime.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const createAnime = async (req, res) => {
  const anime = await AnimeService.createAnime({ ...req.body, createdBy: req.user.id });
  return successResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Anime created',
    data: anime,
  });
};

export const updateAnime = async (req, res) => {
  const anime = await AnimeService.updateAnime(req.params.id, req.body);
  return successResponse(res, { message: 'Anime updated', data: anime });
};

export const deleteAnime = async (req, res) => {
  await AnimeService.deleteAnime(req.params.id);
  return successResponse(res, { message: 'Anime removed' });
};

export const getAnime = async (req, res) => {
  const anime = await AnimeService.getAnimeBySlug(req.params.slug);
  return successResponse(res, { data: anime });
};

export const getAnimeById = async (req, res) => {
  const anime = await AnimeService.getAnimeById(req.params.id);
  return successResponse(res, { data: anime });
};

export const listAnime = async (req, res) => {
  const result = await AnimeService.listAnime(req.query);
  return successResponse(res, { data: result.items, meta: result.pagination });
};

export const homepage = async (req, res) => {
  const sections = await AnimeService.getHomepageSections();
  return successResponse(res, { data: sections });
};

export const upsertEpisode = async (req, res) => {
  const episode = await AnimeService.upsertEpisode(req.params.animeId, req.body);
  return successResponse(res, {
    statusCode: req.body.id ? StatusCodes.OK : StatusCodes.CREATED,
    message: req.body.id ? 'Episode updated' : 'Episode created',
    data: episode,
  });
};

export const deleteEpisode = async (req, res) => {
  await AnimeService.deleteEpisode(req.params.episodeId);
  return successResponse(res, { message: 'Episode removed' });
};

export const listEpisodes = async (req, res) => {
  const episodes = await AnimeService.listEpisodes(req.params.animeId);
  return successResponse(res, { data: episodes });
};

export const toggleLike = async (req, res) => {
  const result = await AnimeService.toggleLike(req.params.id, req.user);
  return successResponse(res, { message: result.liked ? 'Anime liked' : 'Anime unliked', data: result });
};

