import { FundingTimeSplit, Provider } from '.';

import { AgeGroup, FundingSource, FundingTime } from '../';

export interface FundingSpace {
  id: number;
  capacity: number;
  provider: Provider;
  source: FundingSource;
  ageGroup: AgeGroup;
  time: FundingTime;
  timeSplit?: FundingTimeSplit;
}
