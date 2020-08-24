import express, { Response, Request, json } from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { router } from './user';
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
router.put(
  '/:childId',
  passAsyncError(async (req, res, next) => {
    try {
      const id = req.params['childId'];
      const manager = getManager();
      const _child = req.body;
      // Delete relations from this object so we don't attempt to update them
      delete _child.family;
      delete _child.enrollments;
      await manager.update(Child, id, _child);
      res.sendStatus(200);
    } catch (err) {
      console.error('\nError saving changes to child: ', err, '\n');
      throw new BadRequestError('Child information not saved');
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
  passAsyncError(async (req: Request, res: Response) => {
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
