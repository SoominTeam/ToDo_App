import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0]; 
        const code = firstError.message;
        
        if (['TITLE_REQUIRED', 'TITLE_TOO_LONG', 'INVALID_INPUT'].includes(code)) {
          return next(new AppError(400, code));
        }
        return next(new AppError(400, 'INVALID_INPUT'));
      }
      next(error);
    }
  };
};