import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const myDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.status(200).json({ success: true, message: 'User retrieved.', data: user });
  } catch (err) {
    next(err);
  }
};

export const userDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.status(200).json({ success: true, message: 'User retrieved.', data: user });
  } catch (err) {
    next(err);
  }
};

export const vendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.getVendors();
    res.status(200).json({ success: true, message: 'Vendors retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const companies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.getCompanies();
    res.status(200).json({ success: true, message: 'Companies retrieved.', data });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated.', data: user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.changePassword(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

export const myBids = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.getMyBids(req.user.id, req.user.role ?? '');
    res.status(200).json({ success: true, message: 'Your bids retrieved.', data });
  } catch (err) {
    next(err);
  }
};
