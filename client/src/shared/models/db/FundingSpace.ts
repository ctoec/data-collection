import {
  FundingTimeSplit,
  Organization,
} from '.';

import { AgeGroup, FundingSource, FundingTime } from '../';

export interface FundingSpace {
  id: number;
  capacity: number;
  organization: Organization;
  source: FundingSource;
  ageGroup: AgeGroup;
  time: FundingTime;
  timeSplit?: FundingTimeSplit;
}
