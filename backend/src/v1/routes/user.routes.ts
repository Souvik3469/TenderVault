import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { myDetails, userDetails, vendors, companies } from '../controllers/user.controller';

const router = Router();

// Specific routes before parameterized ones
router.get('/me', authMiddleware, myDetails);
router.get('/vendors', authMiddleware, vendors);
router.get('/companies', authMiddleware, companies);
router.get('/:userId', authMiddleware, userDetails);

export default router;
