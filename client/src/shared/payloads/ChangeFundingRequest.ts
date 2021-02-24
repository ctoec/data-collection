import { ReportingPeriod, Funding } from '../models';

export interface ChangeFundingRequest {
  newFunding?: Funding;
  oldFunding?: {
    lastReportingPeriod: ReportingPeriod;
  };
}
