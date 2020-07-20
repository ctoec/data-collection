import { Age } from './age';
import { Funding } from './funding';
import { FundingSource } from './fundingSource';
import { FundingTime } from './fundingTime';
import { FundingTimeSplit } from './fundingTimeSplit';
import { FundingTimeSplitUtilization } from './fundingTimeSplitUtilization';
import { Organization } from './organization';

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