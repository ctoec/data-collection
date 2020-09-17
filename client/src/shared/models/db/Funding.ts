import { Enrollment, FundingSpace, ReportingPeriod } from '.';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Funding extends ObjectWithValidationErrors {
  id: number;
  enrollment: Enrollment;
  fundingSpace: FundingSpace;
  firstReportingPeriod?: ReportingPeriod;
  lastReportingPeriod?: ReportingPeriod;
}
