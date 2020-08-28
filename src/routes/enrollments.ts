import express from 'express';
import { getManager } from 'typeorm';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Enrollment } from '../entity';
import { NotFoundError } from '../middleware/error/errors';

export const enrollmentsRouter = express.Router();

enrollmentsRouter.put(
  '/:enrollmentId',
  passAsyncError(async (req, res) => {
    const id = parseInt(req.params['enrollmentId']);
    let enrollment = await getManager().findOne(Enrollment, id);

    if (!enrollment) throw new NotFoundError();

    enrollment = getManager().merge(Enrollment, enrollment, req.body);
    await getManager().save(enrollment);
    res.send(200);
  })
);
