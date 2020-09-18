import { FundingSource, FundingTime } from '.';

export interface FundingSourceTime {
  displayName: string;
  fundingSources: FundingSource[]; //  All FundingSources that can have the associated FundingTimes
  fundingTimes: FundingTimeInput[]; //  All valid FundingTimes for the associated FundingSources
}

export interface FundingTimeInput {
  formats: string[]; //  All accepted input formats for this funding time
  value: FundingTime; //  The actual underlying funding time
}
