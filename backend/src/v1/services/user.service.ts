import bcrypt from 'bcrypt';
import prisma from '../../prisma';
import { AppError } from '../../utils/errors';
import { UpdateProfileInput, ChangePasswordInput } from '../dtos/user.dto';

// Strip password hash before returning any user to the client
const safe = <T extends { password?: string | null }>(user: T) => {
  const { password: _pw, ...rest } = user;
  return rest;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);
  return safe(user);
};

export const getMe = (userId: string) => getUserById(userId);

export const getVendors = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'vendor' },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(safe);
};

export const getCompanies = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'company' },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(safe);
};

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  const user = await prisma.user.update({ where: { id: userId }, data: input });
  return safe(user);
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) throw new AppError('User not found.', 404);

  const isMatch = await bcrypt.compare(input.currentPassword, user.password);
  if (!isMatch) throw new AppError('Current password is incorrect.', 400);

  if (input.currentPassword === input.newPassword)
    throw new AppError('New password must differ from the current one.', 400);

  const hashed = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
};

export const getMyBids = async (userId: string, role: string) => {
  if (role !== 'vendor') throw new AppError('Only vendors can view their bids.', 403);

  return prisma.bid.findMany({
    where: { vendorId: userId },
    include: {
      tender: {
        select: {
          id: true,
          title: true,
          category: true,
          minimumBid: true,
          status: true,
          companyName: true,
          imageUrl: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
