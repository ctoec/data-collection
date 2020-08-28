import express from 'express';
import { getManager } from 'typeorm';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Enrollment } from '../entity';
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
