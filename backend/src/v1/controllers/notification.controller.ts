import { Request, Response, NextFunction } from 'express';
import * as notifService from '../services/notification.service';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await notifService.getMyNotifications(req.user.id);
    res.status(200).json({ success: true, message: 'Notifications retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await notifService.getUnreadCount(req.user.id);
    res.status(200).json({ success: true, message: 'Unread count retrieved.', data: { count } });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await notifService.markRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.', data });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notifService.markAllRead(req.user.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};
