import {
  AgeGroup,
  FundingSource,
  FundingTime,
  FundingTimeSplit,
  Organization,
} from './';

export interface FundingSpace {
  id: number;
  capacity: number;
  organization: Organization;
  source: FundingSource;
  ageGroup: AgeGroup;
  time: FundingTime;
  timeSplit?: FundingTimeSplit;
}
