import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { NotFoundError } from './errors';

/**
 * Error handling middleware to log errors, and send the appropriate
 * error response. Currently implements:
 * - 401: Unauthorized errors
 * - 404: Not found errors
 * - 500: Internal server errors (default catchall error)
 */
export const handleError = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    switch (err.name) {
      case UnauthorizedError.name:
        res
          .status((err as UnauthorizedError).status)
          .json({ error: err.message });
        break;

      case NotFoundError.name:
        res.status((err as NotFoundError).status).json({ error: err.message });
        break;

      default:
        res.status(500).json({ error: err.toString() });
    }
    console.error(err);
  } else {
    next();
  }
};
