import { Enrollment } from './enrollment';
import { FundingSource } from './fundingSource';
import { FundingSpace } from './fundingSpace';
import { ReportingPeriod } from './reportingPeriod';
import { User } from './user';

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