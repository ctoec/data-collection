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
    console.error(err);

    // UnauthorizedError comes from jwt-express middleware, and so
    // does not subclass our custom ApiError
    if (err instanceof ApiError || err instanceof UnauthorizedError) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: err.toString() });
  } else {
    next();
  }
};
