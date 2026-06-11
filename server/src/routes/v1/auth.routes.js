import { Router } from 'express';
import { register, login, profile } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../../validators/auth.validator.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/profile', authenticate, profile);

export default router;

