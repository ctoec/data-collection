import { getManager, LessThan, Raw } from 'typeorm';
import { ReportingPeriod } from '../entity';
import moment from 'moment';

/**
 * Get all reporting periods, less than 3 years old
 * and less than 3 years in the future
 */
export const getReportingPeriods = async () => {
  const threeYearsAgo = moment().add(-3, 'years').format('YYYY-MM-DD');
  const threeYearsAhead = moment().add(3, 'years').format('YYYY-MM-DD');
  return getManager().find(ReportingPeriod, {
    where: {
      period: Raw(
        (column) =>
          `${column} > '${threeYearsAgo}' AND ${column} < '${threeYearsAhead}'`
      ),
    },
  });
};
