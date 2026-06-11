import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { commentSchema } from '../../validators/comment.validator.js';
import { createComment, deleteComment, listComments, toggleLike, updateComment } from '../../controllers/comment.controller.js';

const router = Router();

router.get('/anime/:animeId', listComments);
router.post('/anime/:animeId', authenticate, validateRequest(commentSchema), createComment);
router.patch('/:commentId', authenticate, validateRequest(commentSchema), updateComment);
router.delete('/:commentId', authenticate, deleteComment);
router.post('/:commentId/like', authenticate, toggleLike);

export default router;

