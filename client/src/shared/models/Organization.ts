import { FundingSpace, Site } from '.';

export interface Organization {
  id: number;
  providerName: string;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
  communityId?: number;
}
