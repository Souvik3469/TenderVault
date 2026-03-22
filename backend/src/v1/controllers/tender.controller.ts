import { Request, Response, NextFunction } from 'express';
import * as tenderService from '../services/tender.service';

export const createTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tender = await tenderService.createTender(
      req.user.id,
      req.user.role ?? '',
      req.user.name ?? '',
      req.body,
    );
    res.status(201).json({ success: true, message: 'Tender created.', data: tender });
  } catch (err) {
    next(err);
  }
};

export const getAllTenders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const data = await tenderService.getAllTenders({ page, limit, category, status });
    res.status(200).json({ success: true, message: 'Tenders retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const searchTenders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.query.name as string;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: '"name" query param is required.' });
    }
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const data = await tenderService.searchTenders(name.trim(), page, limit);
    res.status(200).json({ success: true, message: 'Tenders retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const getMyTenders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.getMyTenders(req.user.id, req.user.role ?? '');
    res.status(200).json({ success: true, message: 'Your tenders retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const getTenderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tender = await tenderService.getTenderById(req.params.tenderId);
    res.status(200).json({ success: true, message: 'Tender retrieved.', data: tender });
  } catch (err) {
    next(err);
  }
};

export const deleteTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tenderService.deleteTender(req.params.tenderId, req.user.id);
    res.status(200).json({ success: true, message: 'Tender deleted.' });
  } catch (err) {
    next(err);
  }
};

export const updateTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tender = await tenderService.updateTender(req.params.tenderId, req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Tender updated.', data: tender });
  } catch (err) {
    next(err);
  }
};

export const reviewTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tender = await tenderService.reviewTender(
      req.params.tenderId,
      req.user.role ?? '',
      req.user.id,
      req.body,
    );
    res.status(200).json({ success: true, message: 'Tender reviewed.', data: tender });
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.getAllCategories();
    res.status(200).json({ success: true, message: 'Categories retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const createBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bid = await tenderService.createBid(
      req.params.tenderId,
      req.user.id,
      req.user.role ?? '',
      req.body,
    );
    res.status(201).json({ success: true, message: 'Bid submitted.', data: bid });
  } catch (err) {
    next(err);
  }
};

export const getBidsForTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.getBidsForTender(req.params.tenderId, req.user.id, req.user.role ?? '');
    res.status(200).json({ success: true, message: 'Bids retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const getBidById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bid = await tenderService.getBidById(req.params.tenderId, req.params.bidId, req.user.id, req.user.role ?? '');
    res.status(200).json({ success: true, message: 'Bid retrieved.', data: bid });
  } catch (err) {
    next(err);
  }
};

export const deleteBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tenderService.deleteBid(req.params.bidId, req.user.id);
    res.status(200).json({ success: true, message: 'Bid deleted.' });
  } catch (err) {
    next(err);
  }
};

export const acceptBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.acceptBid(req.params.bidId, req.user.id);
    res.status(200).json({ success: true, message: 'Bid accepted.', data });
  } catch (err) {
    next(err);
  }
};

export const rejectBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.rejectBid(req.params.bidId, req.user.id);
    res.status(200).json({ success: true, message: 'Bid rejected.', data });
  } catch (err) {
    next(err);
  }
};

// ─── Tender Lifecycle ─────────────────────────────────────────────────────────

export const publishTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.publishTender(req.params.tenderId, req.user.id);
    res.status(200).json({ success: true, message: 'Tender published.', data });
  } catch (err) {
    next(err);
  }
};

export const closeTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.closeTender(req.params.tenderId, req.user.id);
    res.status(200).json({ success: true, message: 'Tender closed.', data });
  } catch (err) {
    next(err);
  }
};

export const cancelTender = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.cancelTender(req.params.tenderId, req.user.id);
    res.status(200).json({ success: true, message: 'Tender cancelled.', data });
  } catch (err) {
    next(err);
  }
};

export const getTenderStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.getTenderStats(req.params.tenderId, req.user.id);
    res.status(200).json({ success: true, message: 'Tender stats retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const withdrawBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.withdrawBid(req.params.bidId, req.user.id);
    res.status(200).json({ success: true, message: 'Bid withdrawn.', data });
  } catch (err) {
    next(err);
  }
};

// ─── Q&A ──────────────────────────────────────────────────────────────────────

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.getQuestions(req.params.tenderId);
    res.status(200).json({ success: true, message: 'Questions retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const askQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.askQuestion(
      req.params.tenderId,
      req.user.id,
      req.user.role ?? '',
      req.body,
    );
    res.status(201).json({ success: true, message: 'Question posted.', data });
  } catch (err) {
    next(err);
  }
};

export const answerQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tenderService.answerQuestion(
      req.params.tenderId,
      req.params.questionId,
      req.user.id,
      req.user.role ?? '',
      req.body,
    );
    res.status(201).json({ success: true, message: 'Answer posted.', data });
  } catch (err) {
    next(err);
  }
};
