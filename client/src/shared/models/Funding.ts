import { Enrollment, FundingSpace, ReportingPeriod } from '.';
import { Moment } from 'moment';

export interface Funding {
  id: number;
  enrollment: Enrollment;
  fundingSpace: FundingSpace;
  firstReportingPeriod: ReportingPeriod;
  lastReportingPeriod?: ReportingPeriod;
}
