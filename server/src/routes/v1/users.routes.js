import { Router } from 'express';
import {
  getWatchlist,
  saveProgress,
  toggleWatchlist,
  updateProfile,
} from '../../controllers/user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { progressSchema, updateProfileSchema, watchlistSchema } from '../../validators/user.validator.js';

const router = Router();

router.use(authenticate);

router.patch('/profile', validateRequest(updateProfileSchema), updateProfile);
router.get('/watchlist', getWatchlist);
router.post('/watchlist', validateRequest(watchlistSchema), toggleWatchlist);
router.post('/progress', validateRequest(progressSchema), saveProgress);

export default router;

