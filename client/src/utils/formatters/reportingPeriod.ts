import { ReportingPeriod } from '../../shared/models';

/**
 * Util to format reporting period like: "March 2020 (3/2-3/31)""
 * @param reportingPeriod
 */
export const reportingPeriodFormatter = (reportingPeriod: ReportingPeriod) =>
  `${reportingPeriod.period.format(
    'MMMM YYYY'
  )} (${reportingPeriod.periodStart.format(
    'M/D'
  )}-${reportingPeriod.periodEnd.format('M/D')})`;
