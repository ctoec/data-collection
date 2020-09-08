import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { getManager } from 'typeorm';
import { Funding } from '../entity';
import {
  NotFoundError,
  ApiError,
  BadRequestError,
} from '../middleware/error/errors';

export const fundingsRouter = express.Router();

fundingsRouter.put(
  '/:fundingId',
  passAsyncError(async (req, res) => {
    try {
      const id = req.params['fundingId'];
      const funding = await getManager().findOne(Funding, id);

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
