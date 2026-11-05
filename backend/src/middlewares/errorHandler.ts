import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, public code: string) {
    super(code);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.code });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }

  console.error(err);
  return res.status(500).json({ error: 'SERVER_ERROR' });
};