import { RequestHandler, Request, Response, NextFunction } from 'express';

/**
 * To avoid having to write the same try/catch logic
 * in every single async middleware function,
 * wrap them in this to handle passing promise rejections
 * and throw exceptions along to the error handling middleware
 *
 * See `routes/enrollmentReport.ts` for an example.
 * @param func
 */
export function passAsyncError(func: RequestHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    // This works the way it needs to so I'm not sure why typescript is complaining
    func(req, res, next).catch(next);
  };
}
