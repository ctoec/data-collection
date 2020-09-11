import { FundingSource, FundingTime } from "../models";

export interface FundingSpaceType {
  displayName: string;
  fundingSources: FundingSource[];
  contractSpaces: ContractSpace[];
}

export interface ContractSpace {
  displayName: string;  //  A user-friendly version of this funding time
  formats: string[];    //  All accepted input formats for this funding time
  time: FundingTime;    //  The actual underlying funding time
}