import { FundingSource } from ".";
import { FundingTimeInput } from "./FundingTime";

export interface FundingSourceTime {
  displayName: string;
  fundingSources: FundingSource[];    //  All FundingSources that can have the associated FundingTimes
  fundingTimes: FundingTimeInput[];   //  All valid FundingTimes for the associated FundingSources 
}