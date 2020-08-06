import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt'

export const handleError = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
		console.error(err);
		if(err.name === UnauthorizedError.name) {
			return res.status(401).json({ error: err.message })
		}
		res.status(500).json({ error: err.toString() });
  } else {
    next();
  }
};
