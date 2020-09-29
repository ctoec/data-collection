import { FundingSpace, Site } from '.';

export interface Provider {
  id: number;
  providerName: string;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
  communityId?: number;
}
