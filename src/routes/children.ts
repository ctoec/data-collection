import express, { Response, Request } from 'express';
import { getManager } from 'typeorm';
import { Child } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { NotFoundError } from '..//middleware/error/errors';

export const childrenRouter = express.Router();

/**
 * /children/:childId GET
 *
 * Returns the given child, with all nested data desired by the client
 * including family, incomeDeterminations, enrollments, and fundings
 */
childrenRouter.get(
  '/:childId',
  passAsyncError(async (req: Request, res: Response) => {
    const childId = req.params['childId'];
    const child = await getManager().findOne(Child, {
      where: { id: childId },
      relations: [
        'family',
        'family.incomeDeterminations',
        'enrollments',
        'enrollments.fundings',
      ],
    });

    if (!child) throw new NotFoundError();

    res.send(child);
  })
);
