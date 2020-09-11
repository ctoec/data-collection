import { FundingSource, FundingTime } from "../models";

export interface FundingSpaceType {
  displayName: string;
  fundingSources: FundingSource[];
  fundingTimes: FundingTimeInput[];
}

export interface FundingTimeInput {
  displayName: string;  //  A user-friendly version of this funding time
  formats: string[];    //  All accepted input formats for this funding time
  value: FundingTime;   //  The actual underlying funding time
}