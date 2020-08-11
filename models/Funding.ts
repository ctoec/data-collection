import { Enrollment, FundingSpace, ReportingPeriod } from './';

export interface Funding {
  id: number;
  enrollment: Enrollment;
  fundingSpace: FundingSpace;
  firstReportingPeriod?: ReportingPeriod;
  lastReportingPeriod?: ReportingPeriod;
}
