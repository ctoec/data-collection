import express, { Response, Request } from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { getManager } from 'typeorm';
import { Child } from '../entity';

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
    const child = await controller.getChildById(childId);
    if (!child) throw new NotFoundError();

    res.send(child);
  })
);

/**
 * /children PUT
 */
childrenRouter.put(
  '/:childId',
  passAsyncError(async (req, res) => {
    try {
      const id = req.params['childId'];
      const child = await getManager().findOne(Child, id);
      if (!child) throw new NotFoundError();

      await getManager().save(getManager().merge(Child, child, req.body));
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error saving changes to child: ', err);
      throw new BadRequestError('Child information not saved.');
    }
  })
);

/**
 * /children/:childId/change-enrollment POST
 *
 * Body: See `client/src/shared/payloads/ChangeEnrollment.ts
 */

childrenRouter.post(
  '/:childId/change-enrollment',
  passAsyncError(async (req, res) => {
    const childId = req.params['childId'];
    try {
      await controller.changeEnrollment(childId, req.body);

      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.error('Error changing enrollment: ', err);
      throw new BadRequestError(
        'Unable to change enrollment. Make sure request payload has expected format.'
      );
    }
  })
);
