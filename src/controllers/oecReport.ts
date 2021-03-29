import { OECReport, User } from '../entity';
import { getManager, In } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';
import { BadRequestError } from '../middleware/error/errors';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Request, Response } from 'express';

export { createOecReport, checkIfAllOrgsSubmitted, getOecReport };

const getOecReport = passAsyncError(async (req: Request, res: Response) => {
  const organizationId: number = Number(req.params['organizationId']);
  const foundOrg = await getManager().findOne(OECReport, {
    where: { organizationId },
  });
  res.send({ submitted: foundOrg ? true : false });
});

const createOecReport = passAsyncError(async (req: Request, res: Response) => {
  const organizationId: number = Number(req.params['organizationId']);
  const user: User = req.user;

  // Verify that the user has org permissions for the org they're
  // trying to submit for
  if (!user.orgPermissions.some((p) => p.organizationId === organizationId)) {
    throw new BadRequestError(
      "You don't have permission to submit data for this organization"
    );
  }
  const report: OECReportInterface = getManager().create(OECReport, {
    organizationId,
    updateMetaData: {
      author: user,
    },
  });
  await getManager().save(report);
});

const checkIfAllOrgsSubmitted = passAsyncError(
  async (req: Request, res: Response) => {
    const orgIds = await getReadAccessibleOrgIds(req.user);
    const foundReports = await getManager().find(OECReport, {
      where: { organizationId: In(orgIds) },
    });

    return orgIds.every((oid) =>
      foundReports.some(
        (foundReport: OECReport) => foundReport.organizationId === Number(oid)
      )
    );
  }
);
