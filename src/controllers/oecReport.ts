import { OECReport, Organization, User } from '../entity';
import { getManager } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { BadRequestError } from '../middleware/error/errors';

export async function createOecReport(
  user: User,
  organizationId: number
): Promise<void> {
  const report: OECReportInterface = await getManager().create(OECReport, {
    organizationId,
    updateMetaData: {
      author: user,
    },
  });
  await getManager().save(report);
}

export async function markDataSubmittedForOrg(
  user: User,
  organizationId: number
) {
  // Verify that the user has org permissions for the org they're
  // trying to submit for
  const readOrgIds = await getReadAccessibleOrgIds(user);
  if (!readOrgIds.includes(String(organizationId))) {
    throw new BadRequestError(
      "You don't have permission to submit data for this organization"
    );
  }
  const org = await getManager().findOne(Organization, String(organizationId));
  org.submittedData = true;
  await getManager().save(org);
}
