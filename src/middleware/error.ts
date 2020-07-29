import { Request, Response, NextFunction } from 'express';

export const handleError = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      error: err.toString(),
    });
  } else {
    next();
  }
};
