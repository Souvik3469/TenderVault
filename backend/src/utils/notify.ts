import { NotificationType } from '@prisma/client';
import prisma from '../prisma';

/**
 * Fire-and-forget notification helper.
 * Never awaited — never blocks the main response flow.
 * Logs silently on failure rather than crashing.
 */
export const notify = (userId: string, body: string, type: NotificationType): void => {
  prisma.notification
    .create({ data: { userId, body, type, read: false } })
    .catch((err) => console.error('[notify]', err));
};
