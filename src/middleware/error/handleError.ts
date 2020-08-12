import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { NotFoundError, BadRequestError, ApiError } from './errors';

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

		if(err instanceof ApiError || err instanceof UnauthorizedError) {
			res.status(err.status).json({ message: err.message });
			return;
		}

    res.status(500).json({ error: err.toString() });
  } else {
    next();
  }
};
