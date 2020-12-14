import { RequestHandler, Request, Response, NextFunction } from 'express';

/**
 * Pretty much:
 * https://github.com/Abazhenov/express-async-handler/blob/master/index.js
 *
 * To avoid having to write the same try/catch logic
 * in every single async middleware function,
 * wrap them in this to handle passing promise rejections
 * and thrown exceptions along to the error handling middleware
 *
 * @param func The request handler function
 */
export function passAsyncError(func: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}
