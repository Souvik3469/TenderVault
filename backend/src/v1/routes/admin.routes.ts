import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { getStats, getAllTendersAdmin } from '../controllers/admin.controller';

const router = Router();

// All admin routes require auth — role check is inside the service
router.get('/stats',   authMiddleware, getStats);
router.get('/tenders', authMiddleware, getAllTendersAdmin);

export default router;
