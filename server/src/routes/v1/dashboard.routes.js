import { Router } from 'express';
import { getDashboardStats } from '../../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { USER_ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate, authorize(USER_ROLES.ADMIN));
router.get('/', getDashboardStats);

export default router;

