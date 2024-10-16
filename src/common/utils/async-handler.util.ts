import { Request, Response, Handler, NextFunction } from 'express';

export const asyncHandler = (handler: Handler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  }
}