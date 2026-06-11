import { z } from 'zod';
import { ANIME_STATUS } from '../constants/anime.js';

const baseAnime = {
  title: z.string().min(1, 'Title is required'),
  synopsis: z.string().min(1, 'Synopsis is required').default('No synopsis available.'),
  genres: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  rating: z.number().min(0).max(10).optional(),
  releaseYear: z.number().min(1980).max(new Date().getFullYear() + 1).optional(),
  status: z.enum(Object.values(ANIME_STATUS)).optional(),
  posterImage: z.union([z.string().url(), z.literal('')]).default(''),
  bannerImage: z.union([z.string().url(), z.literal('')]).default(''),
  featured: z.boolean().optional(),
  trendingScore: z.number().optional(),
  popularity: z.number().optional(),
};

export const createAnimeSchema = z.object({
  body: z.object(baseAnime),
});

export const updateAnimeSchema = z.object({
  body: z.object(baseAnime).partial(),
});

export const listAnimeSchema = z.object({
  query: z.object({
    genres: z.string().optional(),
    status: z.enum(Object.values(ANIME_STATUS)).optional(),
    search: z.string().optional(),
    sort: z.enum(['recent', 'popular']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const episodeSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    number: z.number().min(1),
    synopsis: z.string().optional(),
    videoUrl: z.string().min(1),
    thumbnail: z.string().optional(),
    duration: z.number().optional(),
    releaseDate: z.string().or(z.date()).optional(),
  }),
});

