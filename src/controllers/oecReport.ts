import { OECReport, User } from '../entity';
import { getManager, In } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';
import { BadRequestError } from '../middleware/error/errors';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';

export async function createOecReport(
  user: User,
  organizationId: number
): Promise<void> {
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
}

export async function checkIfAllOrgsSubmitted(user: User) {
  const orgIds = await getReadAccessibleOrgIds(user);
  const foundReports = await getManager().find(OECReport, {
    where: { organizationId: In(orgIds) },
  });
  
  return orgIds.every((oid) =>
    foundReports.some((foundReport: OECReport) => foundReport.organizationId === Number(oid))
  );
}
