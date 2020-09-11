import {
  AgeGroup,
  FundingSource,
  FundingTimeInput,
  FundingTimeSplit,
  Organization,
} from '.';

export interface FundingSpace {
  id: number;
  capacity: number;
  organization: Organization;
  source: FundingSource;
  ageGroup: AgeGroup;
  time: FundingTimeInput;
  timeSplit?: FundingTimeSplit;
}
