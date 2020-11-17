import express, { Request, Response } from 'express';
import { getManager, In } from 'typeorm';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Enrollment, Funding } from '../entity';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
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
      const readOrgIds = await getReadAccessibleOrgIds(req.user);
      let enrollment = await getManager().findOne(Enrollment, id, {
        where: { site: { organizationId: In(readOrgIds) } },
      });

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
    const enrollmentId = parseInt(req.params['enrollmentId']);
    try {
      const enrollment = await getManager().find(Enrollment, {
        id: enrollmentId,
      });
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
      const id = req.params['fundingId'];
      const readOrgIds = await getReadAccessibleOrgIds(req.user);
      const funding = await getManager().findOne(Funding, id, {
        where: { enrollment: { site: { organizationId: In(readOrgIds) } } },
      });

      if (!funding) throw new NotFoundError();

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
      const fundingId = parseInt(req.params['fundingId']);
      const readOrgIds = await getReadAccessibleOrgIds(req.user);
      const funding = await getManager().find(Funding, { id: fundingId });
      await getManager().softRemove(funding);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested funding source: ', err);
      throw new BadRequestError('Funding not deleted');
    }
  })
);
