import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import tenderRoutes from './tender.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth',          authRoutes);
router.use('/users',         userRoutes);
router.use('/tenders',       tenderRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin',         adminRoutes);

export default router;
