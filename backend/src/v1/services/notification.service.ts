import prisma from '../../prisma';
import { AppError } from '../../utils/errors';

export const getMyNotifications = async (userId: string) =>
  prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

export const getUnreadCount = async (userId: string) =>
  prisma.notification.count({ where: { userId, read: false } });

export const markRead = async (notifId: string, userId: string) => {
  const notif = await prisma.notification.findUnique({ where: { id: notifId } });
  if (!notif) throw new AppError('Notification not found.', 404);
  if (notif.userId !== userId) throw new AppError('Unauthorized.', 403);
  return prisma.notification.update({ where: { id: notifId }, data: { read: true } });
};

export const markAllRead = async (userId: string) => {
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
};
