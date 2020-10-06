import express, { Request, Response } from 'express';
import * as controller from '../controllers/oecReport';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const oecReportRouter = express.Router();

oecReportRouter.put(
  '/:organizationId',
  passAsyncError(async (req: Request, res: Response) => {
    const organizationId: number = Number(req.params['organizationId']);
    await controller.createOecReport(organizationId);

    res.sendStatus(200);
  })
);
