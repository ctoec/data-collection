import { ReportingPeriod, Funding } from '../models';

export interface ChangeFunding {
  newFunding?: Funding;
  oldFunding?: {
    lastReportingPeriod: ReportingPeriod;
  };
}
