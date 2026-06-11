import { z } from 'zod';
import { USER_ROLES } from '../constants/roles.js';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

