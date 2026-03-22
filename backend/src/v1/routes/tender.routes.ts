import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import * as tenderController from '../controllers/tender.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateTenderDto, UpdateTenderDto, ReviewTenderDto, CreateBidDto } from '../dtos/tender.dto';

const router = Router();

// ─── Bid routes with fixed paths FIRST (before /:tenderId catch-all) ─────────
router.delete('/bids/:bidId', authMiddleware, tenderController.deleteBid);
router.put('/bids/:bidId/accept', authMiddleware, tenderController.acceptBid);
router.put('/bids/:bidId/reject', authMiddleware, tenderController.rejectBid);

// ─── Tender collection routes ─────────────────────────────────────────────────
router.get('/', authMiddleware, tenderController.getAllTenders);
router.post('/', authMiddleware, validate(CreateTenderDto), tenderController.createTender);
router.get('/search', authMiddleware, tenderController.searchTenders);
router.get('/mine', authMiddleware, tenderController.getMyTenders);
router.get('/categories', authMiddleware, tenderController.getAllCategories);

// ─── Tender item routes ───────────────────────────────────────────────────────
router.get('/:tenderId', authMiddleware, tenderController.getTenderById);
router.put('/:tenderId', authMiddleware, validate(UpdateTenderDto), tenderController.updateTender);
router.delete('/:tenderId', authMiddleware, tenderController.deleteTender);
router.put('/:tenderId/review', authMiddleware, validate(ReviewTenderDto), tenderController.reviewTender);

// ─── Bid routes scoped to a tender ───────────────────────────────────────────
router.get('/:tenderId/bids', authMiddleware, tenderController.getBidsForTender);
router.post('/:tenderId/bids', authMiddleware, validate(CreateBidDto), tenderController.createBid);

export default router;
