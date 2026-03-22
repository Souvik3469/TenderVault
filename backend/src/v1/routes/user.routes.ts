import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UpdateProfileDto, ChangePasswordDto } from '../dtos/user.dto';
import {
  myDetails,
  userDetails,
  vendors,
  companies,
  updateProfile,
  changePassword,
  myBids,
} from '../controllers/user.controller';

const router = Router();

// ─── My account ───────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, myDetails);
router.put('/me', authMiddleware, validate(UpdateProfileDto), updateProfile);
router.put('/me/password', authMiddleware, validate(ChangePasswordDto), changePassword);
router.get('/me/bids', authMiddleware, myBids);

// ─── Directories (specific before :userId) ───────────────────────────────────
router.get('/vendors', authMiddleware, vendors);
router.get('/companies', authMiddleware, companies);

// ─── User by ID ───────────────────────────────────────────────────────────────
router.get('/:userId', authMiddleware, userDetails);

export default router;
