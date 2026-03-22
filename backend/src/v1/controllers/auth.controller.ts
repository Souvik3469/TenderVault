import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken } = await authService.loginUser(req.body);
    res.cookie('accessToken', accessToken, { maxAge: 30 * 60 * 1000, httpOnly: true });
    res.status(200).json({ success: true, message: 'Login successful.', data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Account created successfully.', data: user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};
