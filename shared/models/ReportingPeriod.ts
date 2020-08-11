import { FundingSource } from '.';

export interface ReportingPeriod {
  id: number;
  type: FundingSource;
  period: Date;
  periodStart: Date;
  periodEnd: Date;
  dueAt: Date;
}
