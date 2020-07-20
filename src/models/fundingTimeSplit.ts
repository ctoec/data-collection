import { FundingSpace } from './fundingSpace';

export interface FundingTimeSplit { 
    id: number;
    fundingSpaceId: number;
    fundingSpace?: FundingSpace;
    fullTimeWeeks: number;
    partTimeWeeks: number;
}