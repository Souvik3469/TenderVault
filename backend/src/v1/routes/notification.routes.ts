import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  getMyNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} from '../controllers/notification.controller';

const router = Router();

router.get('/',              authMiddleware, getMyNotifications);
router.get('/unread-count',  authMiddleware, getUnreadCount);
router.patch('/read-all',    authMiddleware, markAllRead);   // fixed path before /:id
router.patch('/:id/read',    authMiddleware, markRead);

export default router;
