import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../utils/errors';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // http-errors compatibility
  const httpErr = err as { status?: number; message?: string };
  if (httpErr.status) {
    return res
      .status(httpErr.status)
      .json({ success: false, message: httpErr.message ?? 'An error occurred.' });
  }

  console.error('[Unhandled Error]', err);
  return res.status(500).json({ success: false, message: 'Internal server error.' });
};
