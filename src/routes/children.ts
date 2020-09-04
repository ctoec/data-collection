import express, { Response, Request } from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { getManager } from 'typeorm';
import { Child, Enrollment, Funding } from '../entity';

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
 * /children/:childId DELETE
 */
childrenRouter.delete(
  '/:childId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const childId = req.params['childId'];
      const child = await getManager().findOne(Child, { id: childId });

      // First need to delete everything that foreign-key references
      // the child: Enrollments, and by extension, funding
      if (!!child.enrollments) {
        child.enrollments.forEach(async (elt: Enrollment) => {
          if (!!elt.fundings) {
            elt.fundings.forEach(async (f: Funding) => {
              await getManager().delete(Funding, f);
            });
          }
          await getManager().delete(Enrollment, elt);
        });
      }
      await getManager().delete(Child, child);
      res.sendStatus(200);
    } catch (err) {
      console.error("Error removing child's record: ", err);
      throw new BadRequestError('Record not deleted.' + err);
    }
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
