import { FundingSpace } from '.';

export interface FundingTimeSplit {
  id: number;
  fundingSpace: FundingSpace;
  fullTimeWeeks: number;
  partTimeWeeks: number;
}
