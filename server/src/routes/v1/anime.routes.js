import { Router } from 'express';
import {
  createAnime,
  deleteAnime,
  deleteEpisode,
  getAnime,
  getAnimeById,
  homepage,
  listAnime,
  listEpisodes,
  toggleLike,
  updateAnime,
  upsertEpisode,
} from '../../controllers/anime.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createAnimeSchema, listAnimeSchema, updateAnimeSchema, episodeSchema } from '../../validators/anime.validator.js';
import { USER_ROLES } from '../../constants/roles.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();

router.get('/home', homepage);
router.get('/', validateRequest(listAnimeSchema), listAnime);
router.get('/id/:id', getAnimeById);
router.get('/:slug', getAnime);

router.post('/:id/like', authenticate, toggleLike);

router.use(authenticate, authorize(USER_ROLES.ADMIN));

router.post('/', validateRequest(createAnimeSchema), createAnime);
router.patch('/:id', validateRequest(updateAnimeSchema), updateAnime);
router.delete('/:id', deleteAnime);

// Video upload endpoint for admin
router.post('/upload/video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }
  // Return the server path to the uploaded file
  const videoUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    videoUrl,
    message: 'Video uploaded successfully'
  });
});

router.get('/:animeId/episodes', listEpisodes);
router.post('/:animeId/episodes', validateRequest(episodeSchema), upsertEpisode);
router.delete('/:animeId/episodes/:episodeId', deleteEpisode);

export default router;

