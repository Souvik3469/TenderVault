import { Router } from 'express';
import { login, register, logout } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

const router = Router();

router.post('/login', validate(LoginDto), login);
router.post('/register', validate(RegisterDto), register);
router.post('/logout', authMiddleware, logout);

export default router;
