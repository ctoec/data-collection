import express, { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Enrollment, Funding } from '../entity';
import {
  NotFoundError,
  ApiError,
  BadRequestError,
} from '../middleware/error/errors';
import * as controller from '../controllers/enrollments';

export const enrollmentsRouter = express.Router();

enrollmentsRouter.put(
  '/:enrollmentId',
  passAsyncError(async (req, res) => {
    try {
      const id = req.params['enrollmentId'];
      const enrollment = await getManager().findOne(Enrollment, id);

      if (!enrollment) throw new NotFoundError();

      await getManager().save(
        getManager().merge(Enrollment, enrollment, req.body)
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.log('Error saving changes to enrollment:', err);
      throw new BadRequestError('Enrollment not saved');
    }
  })
);

enrollmentsRouter.post(
  '/:enrollmentId/change-funding',
  passAsyncError(async (req, res) => {
    const enrollmentId = parseInt(req.params['enrollmentId']);
    try {
      await controller.changeFunding(enrollmentId, req.body);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.error('Error changing funding: ', err);
      throw new BadRequestError(
        'Unable to change funding. Make sure request payload has expected format'
      );
    }
  })
);

enrollmentsRouter.post(
  '/:enrollmentId/withdraw',
  passAsyncError(async (req, res) => {
    const enrollmentId = parseInt(req.params['enrollmentId']);
    try {
      await controller.withdraw(enrollmentId, req.body);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error withdrawing enrollment: ', err);
      throw new BadRequestError(
        'Unable to withdraw enrollment. Make sure request payload has expected format'
      );
    }
  })
);

enrollmentsRouter.delete(
  '/:enrollmentId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const enrollmentId = parseInt(req.params['enrollmentId']);
      const enrollment = await getManager().findOne(Enrollment, {
        id: enrollmentId,
      });
      if (enrollment.fundings) {
        for (let i = 0; i < enrollment.fundings.length; i++) {
          await getManager().delete(Funding, {
            id: enrollment.fundings[i].id,
            enrollmentId: enrollmentId,
          });
        }
      }
      await getManager().delete(Enrollment, { id: enrollmentId });
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested enrollment: ', err);
      throw new BadRequestError('Enrollment not deleted ' + err);
    }
  })
);
