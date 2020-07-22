import { Enrollment } from './enrollment';
import { ReportingPeriod } from './reportingPeriod';
import { User } from './user';
import { Organization } from './organization';
import { Age } from './age';
import { CdcReport } from './cdcReport';

export enum FundingSource {
  CDC = 'CDC',
}

export enum FundingTime {
  Full = 'Full',
  Part = 'Part',
  Split = 'Split',
}

export interface Funding {
  id: number;
  enrollmentId: number;
  enrollment?: Enrollment;
  fundingSpace?: FundingSpace;
  fundingSpaceId: number;
  source?: FundingSource;
  firstReportingPeriodId?: number;
  firstReportingPeriod?: ReportingPeriod;
  lastReportingPeriodId?: number;
  lastReportingPeriod?: ReportingPeriod;
  readonly authorId?: number;
  author?: User;
  readonly updatedAt?: Date;
}

export interface FundingSpace {
  id: number;
  capacity: number;
  organizationId: number;
  organization?: Organization;
  source: FundingSource;
  ageGroup: Age;
  fundings?: Array<Funding>;
  time: FundingTime;
  timeSplit?: FundingTimeSplit;
  readonly timeSplitUtilizations?: Array<FundingTimeSplitUtilization>;
}

export interface FundingTimeSplit {
  id: number;
  fundingSpaceId: number;
  fundingSpace?: FundingSpace;
  fullTimeWeeks: number;
  partTimeWeeks: number;
}

export interface FundingTimeSplitUtilization {
  id: number;
  reportingPeriodId: number;
  reportingPeriod?: ReportingPeriod;
  reportId: number;
  report?: CdcReport;
  fundingSpaceId: number;
  fundingSpace?: FundingSpace;
  fullTimeWeeksUsed: number;
  partTimeWeeksUsed: number;
}
