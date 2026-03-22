import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import tenderRoutes from './tender.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tenders', tenderRoutes);

export default router;
