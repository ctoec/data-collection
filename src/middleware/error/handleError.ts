import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { ApiError } from './errors';

/**
 * Error handling middleware to log errors, and send the appropriate
 * error response.
 */
export const handleError = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    // UnauthorizedError comes from jwt-express middleware, and so
    // does not subclass our custom ApiError
    if (err instanceof ApiError || err instanceof UnauthorizedError) {
      res.status(err.status).json({
        message: err.message,
        ...err,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: err.toString() });
  } else {
    next();
  }
};
