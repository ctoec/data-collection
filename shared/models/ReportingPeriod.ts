import { FundingSource } from '.';
import { Moment } from 'moment';

export interface ReportingPeriod {
  id: number;
  type: FundingSource;
  period: Moment;
  periodStart: Moment;
  periodEnd: Moment;
  dueAt: Moment;
}
