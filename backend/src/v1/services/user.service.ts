import prisma from '../../prisma';
import { AppError } from '../../utils/errors';

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

export const getVendors = async () =>
  prisma.user.findMany({ where: { role: 'vendor' }, orderBy: { createdAt: 'desc' } });

export const getCompanies = async () =>
  prisma.user.findMany({ where: { role: 'company' }, orderBy: { createdAt: 'desc' } });
