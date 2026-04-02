import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import * as tc from '../controllers/tender.controller';
import { validate } from '../middlewares/validate.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import {
  CreateTenderDto,
  UpdateTenderDto,
  ReviewTenderDto,
  CreateBidDto,
  QuestionDto,
  AnswerDto,
} from '../dtos/tender.dto';

const router = Router();

// ─── Top-level bid routes (fixed paths BEFORE /:tenderId) ─────────────────────
router.delete('/bids/:bidId',          authMiddleware, tc.deleteBid);
router.patch('/bids/:bidId/withdraw',  authMiddleware, tc.withdrawBid);
router.put('/bids/:bidId/accept',      authMiddleware, tc.acceptBid);
router.put('/bids/:bidId/reject',      authMiddleware, tc.rejectBid);

// ─── Image upload ──────────────────────────────────────────────────────────────
router.post('/upload', authMiddleware, uploadSingle, tc.uploadImage);

// ─── Tender collection ─────────────────────────────────────────────────────────
// GET /tenders?page=&limit=&category=&status=
router.get('/',           authMiddleware, tc.getAllTenders);
router.post('/',          authMiddleware, validate(CreateTenderDto), tc.createTender);
// GET /tenders/search?name=&page=&limit=
router.get('/search',     authMiddleware, tc.searchTenders);
router.get('/mine',       authMiddleware, tc.getMyTenders);
router.get('/won',        authMiddleware, tc.getWonTenders);
router.get('/categories', authMiddleware, tc.getAllCategories);

// ─── Tender item ───────────────────────────────────────────────────────────────
router.get('/:tenderId',         authMiddleware, tc.getTenderById);
router.put('/:tenderId',         authMiddleware, validate(UpdateTenderDto), tc.updateTender);
router.delete('/:tenderId',      authMiddleware, tc.deleteTender);
router.get('/:tenderId/stats',   authMiddleware, tc.getTenderStats);

// Lifecycle transitions
router.patch('/:tenderId/publish', authMiddleware, tc.publishTender);
router.patch('/:tenderId/close',   authMiddleware, tc.closeTender);
router.patch('/:tenderId/cancel',  authMiddleware, tc.cancelTender);

// Admin review
router.put('/:tenderId/review',  authMiddleware, validate(ReviewTenderDto), tc.reviewTender);

// ─── Bids scoped to a tender ───────────────────────────────────────────────────
router.get('/:tenderId/bids',             authMiddleware, tc.getBidsForTender);
router.post('/:tenderId/bids',            authMiddleware, validate(CreateBidDto), tc.createBid);
router.get('/:tenderId/bids/:bidId',      authMiddleware, tc.getBidById);

// ─── Q&A scoped to a tender ────────────────────────────────────────────────────
router.get('/:tenderId/questions',                              authMiddleware, tc.getQuestions);
router.post('/:tenderId/questions',                             authMiddleware, validate(QuestionDto), tc.askQuestion);
router.post('/:tenderId/questions/:questionId/answers',         authMiddleware, validate(AnswerDto), tc.answerQuestion);

export default router;
