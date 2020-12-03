import express, { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Enrollment, Funding } from '../entity';
import { ApiError, BadRequestError } from '../middleware/error/errors';
import * as controller from '../controllers/enrollments';

export const enrollmentsRouter = express.Router();

enrollmentsRouter.put(
  '/:enrollmentId',
  passAsyncError(async (req, res) => {
    try {
      const enrollmentId = req.params['enrollmentId'];
      const enrollment = await controller.getEnrollment(enrollmentId, req.user, true);
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
      await controller.changeFunding(enrollmentId, req.user, req.body);
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
      await controller.withdraw(enrollmentId, req.user, req.body);
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
      const enrollment = await controller.getEnrollment(enrollmentId, req.user);

      await getManager().softRemove(enrollment);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested enrollment: ', err);
      throw new BadRequestError('Enrollment not deleted ' + err);
    }
  })
);

enrollmentsRouter.put(
  '/:enrollmentId/fundings/:fundingId',
  passAsyncError(async (req, res) => {
    try {
      const enrollmentId = req.params['enrollmentId'];
      const fundingId = req.params['fundingId'];
      const funding = await controller.getFunding(
        enrollmentId,
        fundingId,
        req.user
      );
      await getManager().save(getManager().merge(Funding, funding, req.body));

      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.log('Error saving changes to funding: ', err);
      throw new BadRequestError('Funding not saved');
    }
  })
);

enrollmentsRouter.delete(
  '/:enrollmentId/fundings/:fundingId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const enrollmentId = req.params['enrollmentId'];
      const fundingId = req.params['fundingId'];
      const funding = await controller.getFunding(
        enrollmentId,
        fundingId,
        req.user
      );

      await getManager().softRemove(funding);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested funding source: ', err);
      throw new BadRequestError('Funding not deleted');
    }
  })
);
