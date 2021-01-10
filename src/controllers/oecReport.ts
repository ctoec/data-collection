import { OECReport, User } from '../entity';
import { getManager } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';
import { BadRequestError } from '../middleware/error/errors';

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
  const report: OECReportInterface = await getManager().create(OECReport, {
    organizationId,
    updateMetaData: {
      author: user,
    },
  });
  await getManager().save(report);
}
