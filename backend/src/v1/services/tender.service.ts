import prisma from '../../prisma';
import { AppError } from '../../utils/errors';
import { notify } from '../../utils/notify';
import {
  CreateTenderInput,
  UpdateTenderInput,
  ReviewTenderInput,
  CreateBidInput,
  QuestionInput,
  AnswerInput,
} from '../dtos/tender.dto';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const safeVendor = <T extends { password?: string | null }>(user: T) => {
  const { password: _pw, ...rest } = user;
  return rest;
};

/**
 * Lazily expire open tenders whose deadline has passed.
 * Called before any read or write that depends on tender status.
 * Returns the (possibly updated) tender, or null if not found.
 */
const autoExpireTender = async (tenderId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) return null;
  if (tender.status === 'open' && tender.deadline && new Date() > tender.deadline) {
    const expired = await prisma.tender.update({
      where: { id: tenderId },
      data: { status: 'closed' },
    });
    // Notify all vendors with pending bids
    const pending = await prisma.bid.findMany({
      where: { tenderId, status: 'pending' },
      select: { vendorId: true },
    });
    pending.forEach((b) =>
      notify(b.vendorId, `The tender "${tender.title}" has closed — the submission deadline has passed.`, 'tender_closed'),
    );
    return expired;
  }
  return tender;
};

/**
 * Bulk-expire all overdue open tenders (called before listing tenders).
 */
const autoExpireAll = async () => {
  const overdue = await prisma.tender.findMany({
    where: { status: 'open', deadline: { lt: new Date() } },
    select: { id: true, title: true },
  });
  if (overdue.length === 0) return;

  await prisma.tender.updateMany({
    where: { id: { in: overdue.map((t) => t.id) } },
    data: { status: 'closed' },
  });

  for (const t of overdue) {
    const pending = await prisma.bid.findMany({
      where: { tenderId: t.id, status: 'pending' },
      select: { vendorId: true },
    });
    pending.forEach((b) =>
      notify(b.vendorId, `The tender "${t.title}" has closed — the submission deadline has passed.`, 'tender_closed'),
    );
  }
};

// ─── Tender Lifecycle ─────────────────────────────────────────────────────────

export const createTender = async (
  userId: string,
  role: string,
  userName: string,
  input: CreateTenderInput,
) => {
  if (role !== 'company') throw new AppError('Only companies can create tenders.', 403);

  return prisma.tender.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      cost: input.cost,
      imageUrl: input.imageUrl,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      status: 'draft',
      companyName: userName,
      owner: { connect: { id: userId } },
    },
  });
};

export const publishTender = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId) throw new AppError('Unauthorized.', 403);
  if (tender.status !== 'draft')
    throw new AppError('Only draft tenders can be published.', 400);

  return prisma.tender.update({ where: { id: tenderId }, data: { status: 'open' } });
};

export const closeTender = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId) throw new AppError('Unauthorized.', 403);
  if (tender.status !== 'open')
    throw new AppError('Only open tenders can be closed.', 400);

  // Notify vendors with pending bids
  const pending = await prisma.bid.findMany({
    where: { tenderId, status: 'pending' },
    select: { vendorId: true },
  });
  pending.forEach((b) =>
    notify(b.vendorId, `The tender "${tender.title}" has been closed for submissions.`, 'tender_closed'),
  );

  return prisma.tender.update({ where: { id: tenderId }, data: { status: 'closed' } });
};

export const cancelTender = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId) throw new AppError('Unauthorized.', 403);
  if (tender.status === 'awarded')
    throw new AppError('Awarded tenders cannot be cancelled.', 400);

  const pending = await prisma.bid.findMany({
    where: { tenderId, status: 'pending' },
    select: { vendorId: true },
  });
  pending.forEach((b) =>
    notify(b.vendorId, `The tender "${tender.title}" has been cancelled.`, 'tender_cancelled'),
  );

  return prisma.tender.update({ where: { id: tenderId }, data: { status: 'cancelled' } });
};

// ─── Tender Queries ───────────────────────────────────────────────────────────

export interface TenderFilter {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  role?: string;
}

export const getAllTenders = async ({
  page = 1,
  limit = 20,
  category,
  status,
  role,
}: TenderFilter) => {
  // Close any open tenders whose deadline has passed before returning results.
  await autoExpireAll();

  // Vendors and companies browsing the marketplace default to open tenders.
  // Admins see everything unless they explicitly filter.
  const resolvedStatus = status !== undefined ? status : role === 'admin' ? undefined : 'open';

  const where = {
    ...(resolvedStatus ? { status: resolvedStatus } : {}),
    ...(category ? { category: { equals: category, mode: 'insensitive' as const } } : {}),
  };

  const skip = (page - 1) * limit;
  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: { select: { id: true, name: true, profileImage: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.tender.count({ where }),
  ]);

  return { tenders, total, page, limit, pages: Math.ceil(total / limit) };
};

export const searchTenders = async (name: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const where = { title: { contains: name, mode: 'insensitive' as const }, status: 'open' };

  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.tender.count({ where }),
  ]);

  return { tenders, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getMyTenders = async (userId: string, role: string) => {
  if (role !== 'company') throw new AppError('Only companies can view their tenders.', 403);

  return prisma.tender.findMany({
    where: { companyId: userId },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getWonTenders = async (userId: string) => {
  return prisma.tender.findMany({
    where: { buyerId: userId, status: 'awarded' },
    include: {
      owner: { select: { id: true, name: true, profileImage: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTenderById = async (tenderId: string) => {
  // Auto-expire if deadline has passed before returning details.
  await autoExpireTender(tenderId);

  const tender = await prisma.tender.findUnique({
    where: { id: tenderId },
    include: {
      owner: { select: { id: true, name: true, profileImage: true, bio: true } },
      _count: { select: { bids: true } },
    },
  });
  if (!tender) throw new AppError('Tender not found.', 404);
  return tender;
};

export const getTenderStats = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId)
    throw new AppError('You can only view stats for your own tenders.', 403);

  const bids = await prisma.bid.findMany({
    where: { tenderId },
    select: { amount: true, status: true },
  });
  const amounts = bids.map((b) => b.amount);

  return {
    total: bids.length,
    byStatus: {
      pending: bids.filter((b) => b.status === 'pending').length,
      accepted: bids.filter((b) => b.status === 'accepted').length,
      rejected: bids.filter((b) => b.status === 'rejected').length,
      withdrawn: bids.filter((b) => b.status === 'withdrawn').length,
    },
    amounts: amounts.length
      ? {
          min: Math.min(...amounts),
          max: Math.max(...amounts),
          avg: amounts.reduce((a, b) => a + b, 0) / amounts.length,
        }
      : null,
  };
};

export const deleteTender = async (tenderId: string, userId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId)
    throw new AppError('You do not have permission to delete this tender.', 403);
  if (tender.status === 'awarded')
    throw new AppError('Awarded tenders cannot be deleted.', 400);

  await prisma.tender.delete({ where: { id: tenderId } });
};

export const updateTender = async (tenderId: string, userId: string, input: UpdateTenderInput) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.companyId !== userId)
    throw new AppError('You do not have permission to update this tender.', 403);
  if (['awarded', 'cancelled'].includes(tender.status ?? ''))
    throw new AppError('Awarded or cancelled tenders cannot be updated.', 400);

  return prisma.tender.update({
    where: { id: tenderId },
    data: {
      ...input,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    },
  });
};

export const reviewTender = async (
  tenderId: string,
  role: string,
  evaluatorId: string,
  input: ReviewTenderInput,
) => {
  if (role !== 'admin') throw new AppError('Only admins can review tenders.', 403);

  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);

  const updated = await prisma.tender.update({
    where: { id: tenderId },
    data: { rating: input.rating, evaluatorId },
  });

  notify(
    tender.companyId,
    `Your tender "${tender.title}" has been reviewed and rated ${input.rating}/5.`,
    'tender_reviewed',
  );

  return updated;
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

  const [activeTender, vendor] = await Promise.all([
    autoExpireTender(tenderId),
    prisma.user.findUnique({ where: { id: vendorId }, select: { name: true } }),
  ]);

  const tender = activeTender;
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.status !== 'open') throw new AppError('This tender is not accepting bids.', 400);
  if (input.amount < tender.cost)
    throw new AppError(`Bid amount must be at least ₹${tender.cost} (the tender reserve price).`, 400);

  const existing = await prisma.bid.findFirst({ where: { tenderId, vendorId } });
  if (existing) throw new AppError('You have already submitted a bid for this tender.', 409);

  const bid = await prisma.bid.create({
    data: {
      amount: input.amount,
      message: input.message,
      status: 'pending',
      vendorName: vendor?.name ?? null,
      tender: { connect: { id: tenderId } },
      company: { connect: { id: tender.companyId } },
      vendor: { connect: { id: vendorId } },
    },
  });

  notify(
    tender.companyId,
    `${vendor?.name ?? 'A vendor'} has submitted a bid on "${tender.title}".`,
    'bid_received',
  );

  return bid;
};

export const getBidsForTender = async (
  tenderId: string,
  userId: string,
  role: string,
) => {
  await autoExpireTender(tenderId);
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);

  // Vendors may only see their own bid — not competitors'
  if (role === 'vendor') {
    const myBid = await prisma.bid.findFirst({
      where: { tenderId, vendorId: userId },
      include: { vendor: { select: { id: true, name: true, email: true, profileImage: true } } },
    });
    return myBid ? [myBid] : [];
  }

  // Company can only see bids for their own tender
  if (role === 'company' && tender.companyId !== userId)
    throw new AppError('You can only view bids for your own tenders.', 403);

  const bids = await prisma.bid.findMany({
    where: { tenderId },
    include: { vendor: true },
    orderBy: { createdAt: 'desc' },
  });

  return bids.map((b) => ({ ...b, vendor: safeVendor(b.vendor) }));
};

export const getBidById = async (tenderId: string, bidId: string, userId: string, role: string) => {
  const bid = await prisma.bid.findFirst({
    where: { id: bidId, tenderId },
    include: { vendor: { select: { id: true, name: true, email: true, profileImage: true } } },
  });
  if (!bid) throw new AppError('Bid not found.', 404);

  // Vendors can only fetch their own bid
  if (role === 'vendor' && bid.vendorId !== userId)
    throw new AppError('Unauthorized.', 403);

  return bid;
};

export const withdrawBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.vendorId !== userId) throw new AppError('Unauthorized.', 403);
  if (bid.status !== 'pending')
    throw new AppError('Only pending bids can be withdrawn.', 400);

  return prisma.bid.update({ where: { id: bidId }, data: { status: 'withdrawn' } });
};

export const deleteBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.vendorId !== userId) throw new AppError('Unauthorized.', 403);
  if (bid.status !== 'pending')
    throw new AppError('Only pending bids can be deleted.', 400);

  await prisma.bid.delete({ where: { id: bidId } });
};

export const acceptBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({ where: { id: bidId }, include: { tender: true } });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.tender.companyId !== userId)
    throw new AppError('You do not have permission to accept this bid.', 403);
  if (bid.status !== 'pending') throw new AppError('Only pending bids can be accepted.', 400);
  if (!['open', 'closed'].includes(bid.tender.status ?? ''))
    throw new AppError('Bids can only be accepted on open or closed tenders.', 400);

  // Capture vendors to notify before transaction mutates their statuses
  const othersToReject = await prisma.bid.findMany({
    where: { tenderId: bid.tenderId, id: { not: bidId }, status: 'pending' },
    select: { vendorId: true },
  });

  const [acceptedBid, updatedTender] = await prisma.$transaction([
    prisma.bid.update({ where: { id: bidId }, data: { status: 'accepted' } }),
    prisma.tender.update({
      where: { id: bid.tenderId },
      data: { status: 'awarded', buyerId: bid.vendorId },
    }),
    prisma.bid.updateMany({
      where: { tenderId: bid.tenderId, id: { not: bidId }, status: 'pending' },
      data: { status: 'rejected' },
    }),
  ]);

  // Notify after successful transaction
  notify(
    bid.vendorId,
    `Congratulations! Your bid on "${bid.tender.title}" has been accepted.`,
    'bid_accepted',
  );
  othersToReject.forEach((b) =>
    notify(b.vendorId, `Your bid on "${bid.tender.title}" was not selected.`, 'bid_rejected'),
  );

  return { acceptedBid, updatedTender };
};

export const rejectBid = async (bidId: string, userId: string) => {
  const bid = await prisma.bid.findUnique({ where: { id: bidId }, include: { tender: true } });
  if (!bid) throw new AppError('Bid not found.', 404);
  if (bid.tender.companyId !== userId)
    throw new AppError('You do not have permission to reject this bid.', 403);
  if (bid.status !== 'pending') throw new AppError('Only pending bids can be rejected.', 400);

  const updated = await prisma.bid.update({ where: { id: bidId }, data: { status: 'rejected' } });

  notify(
    bid.vendorId,
    `Your bid on "${bid.tender.title}" has been rejected.`,
    'bid_rejected',
  );

  return updated;
};

// ─── Q&A ──────────────────────────────────────────────────────────────────────

export const askQuestion = async (tenderId: string, userId: string, role: string, input: QuestionInput) => {
  if (role !== 'vendor') throw new AppError('Only vendors can ask questions.', 403);

  await autoExpireTender(tenderId);
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);
  if (tender.status !== 'open') throw new AppError('Questions can only be posted on open tenders.', 400);

  const question = await prisma.question.create({
    data: {
      text: input.text,
      tender: { connect: { id: tenderId } },
      asker: { connect: { id: userId } },
    },
    include: { asker: { select: { id: true, name: true, profileImage: true } } },
  });

  notify(tender.companyId, `A vendor has a question on "${tender.title}".`, 'question_asked');

  return question;
};

export const getQuestions = async (tenderId: string) => {
  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender) throw new AppError('Tender not found.', 404);

  return prisma.question.findMany({
    where: { tenderId },
    include: {
      asker: { select: { id: true, name: true, profileImage: true } },
      answers: {
        include: { owner: { select: { id: true, name: true, role: true, profileImage: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const answerQuestion = async (
  tenderId: string,
  questionId: string,
  userId: string,
  role: string,
  input: AnswerInput,
) => {
  if (!['company', 'admin'].includes(role))
    throw new AppError('Only companies and admins can answer questions.', 403);

  const question = await prisma.question.findFirst({
    where: { id: questionId, tenderId },
    include: { tender: true },
  });
  if (!question) throw new AppError('Question not found.', 404);

  if (role === 'company' && question.tender.companyId !== userId)
    throw new AppError('You can only answer questions for your own tenders.', 403);

  const answer = await prisma.answer.create({
    data: {
      text: input.text,
      question: { connect: { id: questionId } },
      owner: { connect: { id: userId } },
    },
    include: { owner: { select: { id: true, name: true, role: true, profileImage: true } } },
  });

  notify(question.userId, `Your question on "${question.tender.title}" has been answered.`, 'question_answered');

  return answer;
};
