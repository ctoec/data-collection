import { OECReport, User } from '../entity';
import { getManager } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';

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
