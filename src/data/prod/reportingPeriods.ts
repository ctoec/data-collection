import { WorkSheet } from 'xlsx';
import { FundingSource } from '../../../client/src/shared/models';
import { parse } from './utils';
import { getManager } from 'typeorm';
import { ReportingPeriod } from '../../entity';

class ReportingPeriodRow {
  type: string = '';
  period: string = '';
  periodStart: string = '';
  periodEnd: string = '';
  dueAt: string = '';
}

const REPORTING_PERIOD_ROW_PROPS = Object.keys(new ReportingPeriodRow());

export const createReportingPeriodData = async (sheetData: WorkSheet) => {
  const parsedData = parse<ReportingPeriodRow>(
    sheetData,
    REPORTING_PERIOD_ROW_PROPS
  );

  console.log(`Attempting to create ${parsedData.length} reporting periods...`);
  let createdCount = 0;

  for (const row of parsedData) {
    try {
      const type = FundingSource[row.type];
      const reportingPeriod = getManager('script').create(ReportingPeriod, {
        ...row,
        type,
      });
      await getManager('script').save(reportingPeriod);
      console.log(`\tCreated reporting period ${type} - ${row.period}`);
      createdCount += 1;
    } catch (err) {
      console.error(
        `\tError creating reporting period ${row.type} - ${row.period}`,
        err
      );
    }
  }

  console.log(`Successfully created ${createdCount} reportingPeriods`);
};
