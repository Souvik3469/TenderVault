import prisma from '../../prisma';
import { AppError } from '../../utils/errors';
import {
  CreateTenderInput,
  UpdateTenderInput,
  ReviewTenderInput,
  CreateBidInput,
} from '../dtos/tender.dto';

// ─── Tenders ─────────────────────────────────────────────────────────────────

export const createTender = async (
  userId: string,
  role: string,
  userName: string,
  input: CreateTenderInput,
) => {
  if (role !== 'company') throw new AppError('Only companies can create tenders.', 403);

  return prisma.tender.create({
    data: {
      ...input,
      companyName: userName,
      owner: { connect: { id: userId } },
    },
  });
};

export const getAllTenders = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.tender.count(),
  ]);
  return { tenders, total, page, limit, pages: Math.ceil(total / limit) };
};

export const searchTenders = async (name: string) =>
  prisma.tender.findMany({
    where: { title: { contains: name, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
  });

export const getMyTenders = async (userId: string, role: string) => {
  if (role !== 'company') throw new AppError('Only companies can view their tenders.', 403);

  return prisma.tender.findMany({
    where: { companyId: userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTenderById = async (tenderId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  return tender;
};

export const deleteTender = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId)
    throw new AppError('You do not have permission to delete this tender.', 403);

  await prisma.tender.delete({ where: { id: tenderId } });
};

export const updateTender = async (
  tenderId: string,
  userId: string,
  input: UpdateTenderInput,
) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId)
    throw new AppError('You do not have permission to update this tender.', 403);

  return prisma.tender.update({ where: { id: tenderId }, data: input });
};

export const reviewTender = async (
  tenderId: string,
  role: string,
  input: ReviewTenderInput,
) => {
  if (role !== 'admin') throw new AppError('Only admins can review tenders.', 403);

  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);

  return prisma.tender.update({ where: { id: tenderId }, data: { rating: input.rating } });
};

export const getAllCategories = async () => {
  const tenders = await prisma.tender.findMany({ select: { category: true } });
  return [...new Set(tenders.map((t) => t.category))];
};

// ─── Bids ─────────────────────────────────────────────────────────────────────

export const createBid = async (
  tenderId: string,
  vendorId: string,
  role: string,
  input: CreateBidInput,
) => {
  if (role !== 'vendor') throw new AppError('Only vendors can submit bids.', 403);

  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.status !== 'unsold') throw new AppError('This tender is no longer accepting bids.', 400);
  if (input.amount < tender.cost)
    throw new AppError(`Bid amount must be at least ${tender.cost}.`, 400);

  // Prevent duplicate bids from the same vendor
  const existing = await prisma.bid.findFirst({ where: { tenderId, vendorId } });
  if (existing) throw new AppError('You have already submitted a bid for this tender.', 409);

  return prisma.bid.create({
    data: {
      amount: input.amount,
      status: 'pending',
      tender: { connect: { id: tenderId } },
      company: { connect: { id: tender.companyId } },
      vendor: { connect: { id: vendorId } },
    },
  });
};

export const getBidsForTender = async (tenderId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);

  return prisma.bid.findMany({
    where: { tenderId },
    include: { vendor: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.vendorId !== userId)
    throw new AppError('You do not have permission to delete this bid.', 403);

  await prisma.bid.delete({ where: { id: bidId } });
};

export const acceptBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { tender: true },
  });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.tender.companyId !== userId)
    throw new AppError('You do not have permission to accept this bid.', 403);
  if (bid.status !== 'pending') throw new AppError('Only pending bids can be accepted.', 400);

  const [acceptedBid, updatedTender] = await Promise.all([
    prisma.bid.update({ where: { id: bidId }, data: { status: 'accepted' } }),
    prisma.tender.update({
      where: { id: bid.tenderId },
      data: { status: 'sold', buyerId: bid.vendorId },
    }),
  ]);

  return { acceptedBid, updatedTender };
};

export const rejectBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { tender: true },
  });
  if (!bid) throw new AppError('Bid not found.', 404);
  // Permission check before status check (consistent with acceptBid)
  if (bid.tender.companyId !== userId)
    throw new AppError('You do not have permission to reject this bid.', 403);
  if (bid.status !== 'pending') throw new AppError('Only pending bids can be rejected.', 400);

  return prisma.bid.update({ where: { id: bidId }, data: { status: 'rejected' } });
};
