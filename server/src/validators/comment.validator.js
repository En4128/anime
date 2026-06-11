import { z } from 'zod';

export const commentSchema = z.object({
  body: z.object({
    episode: z.string().optional(),
    content: z.string().min(3).max(500),
  }),
});

