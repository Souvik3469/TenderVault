import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.getStats(req.user.role ?? '');
    res.status(200).json({ success: true, message: 'Stats retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const getAllTendersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = req.query.status as string | undefined;
    const category = req.query.category as string | undefined;
    const data = await adminService.getAllTendersAdmin(req.user.role ?? '', page, limit, status, category);
    res.status(200).json({ success: true, message: 'Tenders retrieved.', data });
  } catch (err) {
    next(err);
  }
};
