import { Moment } from 'moment';
import { ReportingPeriod } from '../entity';

export const reportingPeriodIncludesDate = (
  rp: ReportingPeriod,
  date: Moment
) => rp.periodStart.isSameOrBefore(date) && rp.periodEnd.isSameOrAfter(date);
