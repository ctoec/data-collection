import { getManager, Raw } from 'typeorm';
import { ReportingPeriod } from '../entity';
import moment from 'moment';
import { FundingSource } from '../../client/src/shared/models';

/**
 * Get all reporting periods, less than 3 years old
 * and less than 3 years in the future
 */
export const getReportingPeriods = async (shortFundingSource?: string) => {
  const threeYearsAgo = moment().add(-3, 'years').format('YYYY-MM-DD');
  const threeYearsAhead = moment().add(3, 'years').format('YYYY-MM-DD');
  const where = {
    period: Raw(
      (column) =>
        `${column} > '${threeYearsAgo}' AND ${column} < '${threeYearsAhead}'`
    ),
  };

  if (shortFundingSource) {
    const fundingSource = Object.values(FundingSource).find((fs) =>
      fs.startsWith(shortFundingSource)
    );
    where['type'] = fundingSource;
  }

  return getManager().find(ReportingPeriod, where);
};

export function reportingPeriodToString(reportingPeriod: ReportingPeriod) {
  return reportingPeriod.period.format('MM/YYYY');
}
