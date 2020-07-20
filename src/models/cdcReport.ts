import { Enrollment } from './enrollment';
import { FundingSource, FundingTimeSplitUtilization } from './funding';
import { Organization } from './organization';
import { ReportingPeriod } from './reportingPeriod';

export interface CdcReport { 
    accredited: boolean;
    c4KRevenue: number;
    retroactiveC4KRevenue?: boolean;
    familyFeesRevenue: number;
    comment?: string;
    timeSplitUtilizations?: Array<FundingTimeSplitUtilization>;
    organizationId: number;
    organization?: Organization;
    id: number;
    type?: FundingSource;
    reportingPeriodId: number;
    reportingPeriod: ReportingPeriod;
    submittedAt?: Date;
    enrollments?: Array<Enrollment>;
}
