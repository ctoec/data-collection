import express, { Request, Response } from 'express';
import * as controller from '../controllers/reportingPeriods';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const reportingPeriodsRouter = express.Router();

reportingPeriodsRouter.get(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    controller.getReportingPeriods();
    res.send(await controller.getReportingPeriods());
  })
);
