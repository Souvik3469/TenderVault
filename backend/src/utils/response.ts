import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  status = 200,
) => res.status(status).json({ success: true, message, data });

export const sendError = (res: Response, message: string, status = 500) =>
  res.status(status).json({ success: false, message });
