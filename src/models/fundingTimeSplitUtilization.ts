import { CdcReport } from './cdcReport';
import { FundingSpace } from './fundingSpace';
import { ReportingPeriod } from './reportingPeriod';

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