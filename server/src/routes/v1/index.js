import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import animeRoutes from './anime.routes.js';
import commentRoutes from './comments.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/anime', animeRoutes);
router.use('/comments', commentRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

