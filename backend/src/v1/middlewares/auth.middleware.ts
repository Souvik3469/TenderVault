import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import prisma from '../../prisma';
import { env } from '../config/env';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
  }

  try {
    const secret = new TextEncoder().encode(env.USER_ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({ where: { id: payload.id as string } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User not found.' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
