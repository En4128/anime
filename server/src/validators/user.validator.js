import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32).optional(),
    bio: z.string().max(280).optional(),
    avatar: z.string().url().optional(),
    banner: z.string().url().optional(),
  }),
});

export const watchlistSchema = z.object({
  body: z.object({
    animeId: z.string(),
  }),
});

export const progressSchema = z.object({
  body: z.object({
    anime: z.string(),
    episode: z.string(),
    progress: z.number().min(0),
    duration: z.number().min(0),
  }),
});

