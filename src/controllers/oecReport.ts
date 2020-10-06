import { OECReport } from '../entity';
import { getManager } from 'typeorm';
import { OECReport as OECReportInterface } from '../../client/src/shared/models';

export async function createOecReport(organizationId: number): Promise<void> {
  const report: OECReportInterface = await getManager().create(OECReport, {
    organizationId,
  });
  await getManager().save(report);
}
