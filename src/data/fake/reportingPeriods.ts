import moment from 'moment';
import { FundingSource } from '../../../client/src/shared/models';
import { ReportingPeriod } from '../../entity';

export const reportingPeriods = [
  ['2020-07-01', '2020-06-29', '2020-08-02', '2020-08-21'],
  ['2020-08-01', '2020-08-03', '2020-08-30', '2020-09-18'],
  ['2020-09-01', '2020-08-31', '2020-09-27', '2020-10-16'],
  ['2020-10-01', '2020-09-28', '2020-11-01', '2020-11-20'],
  ['2020-11-01', '2020-11-02', '2020-11-29', '2020-12-18'],
  ['2020-12-01', '2020-11-30', '2020-12-27', '2021-01-15'],
  ['2021-01-01', '2020-12-30', '2021-02-02', '2021-02-21'],
  ['2021-02-01', '2021-02-03', '2021-03-01', '2021-03-20'],
  ['2021-03-01', '2021-03-02', '2021-03-29', '2021-04-17'],
  ['2021-04-01', '2021-03-30', '2021-04-26', '2021-05-15'],
  ['2021-05-01', '2021-04-27', '2021-05-31', '2021-06-19'],
  ['2021-06-01', '2021-06-01', '2021-06-28', '2021-07-17'],
];

export const getReportingPeriodFromDates = (
  fundingSource: FundingSource,
  dates
): Omit<ReportingPeriod, 'id'> => {
  return {
    type: fundingSource,
    period: moment.utc(dates[0]),
    periodStart: moment.utc(dates[1]),
    periodEnd: moment.utc(dates[2]),
    dueAt: moment.utc(dates[3]),
  };
};
