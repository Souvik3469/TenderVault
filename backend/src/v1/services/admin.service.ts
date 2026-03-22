import prisma from '../../prisma';
import { AppError } from '../../utils/errors';

export const getStats = async (role: string) => {
  if (role !== 'admin') throw new AppError('Admin access required.', 403);

  const [totalUsers, vendors, companies, totalTenders, draftTenders, openTenders, closedTenders, awardedTenders, cancelledTenders, totalBids] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'vendor' } }),
      prisma.user.count({ where: { role: 'company' } }),
      prisma.tender.count(),
      prisma.tender.count({ where: { status: 'draft' } }),
      prisma.tender.count({ where: { status: 'open' } }),
      prisma.tender.count({ where: { status: 'closed' } }),
      prisma.tender.count({ where: { status: 'awarded' } }),
      prisma.tender.count({ where: { status: 'cancelled' } }),
      prisma.bid.count(),
    ]);

  return {
    users: { total: totalUsers, vendors, companies },
    tenders: { total: totalTenders, draft: draftTenders, open: openTenders, closed: closedTenders, awarded: awardedTenders, cancelled: cancelledTenders },
    bids: { total: totalBids },
  };
};

export const getAllTendersAdmin = async (
  role: string,
  page = 1,
  limit = 20,
  status?: string,
  category?: string,
) => {
  if (role !== 'admin') throw new AppError('Admin access required.', 403);

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
  };
  const skip = (page - 1) * limit;

  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.tender.count({ where }),
  ]);

  return { tenders, total, page, limit, pages: Math.ceil(total / limit) };
};
