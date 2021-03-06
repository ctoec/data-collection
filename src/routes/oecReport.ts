import express, { Request, Response } from 'express';
import { OECReport } from '../entity';
import { getManager } from 'typeorm';
import * as controller from '../controllers/oecReport';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const oecReportRouter = express.Router();

oecReportRouter.get(
  '/are-all-orgs-submitted',
  passAsyncError(async (req: Request, res: Response) => {
    const allSubmitted = await controller.checkIfAllOrgsSubmitted(req.user);
    res.send({ allSubmitted });
  })
);

oecReportRouter.get(
  `/:organizationId`,
  passAsyncError(async (req: Request, res: Response) => {
    const organizationId: number = Number(req.params['organizationId']);
    const foundOrg = await getManager().findOne(OECReport, {
      where: { organizationId },
    });
    res.send({ submitted: foundOrg ? true : false });
  })
);

oecReportRouter.put(
  '/:organizationId',
  passAsyncError(async (req: Request, res: Response) => {
    const organizationId: number = Number(req.params['organizationId']);
    await controller.createOecReport(req.user, organizationId);
    res.sendStatus(200);
  })
);
