import express from 'express';
import { ForbiddenError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/summary';

export const summaryRouter = express.Router();

summaryRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) {
      throw new ForbiddenError();
    }

    res.send(await controller.getSummaryResponse());
  })
);
