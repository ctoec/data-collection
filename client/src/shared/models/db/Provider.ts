import { FundingSpace, Site } from '.';
import { Organization } from './Organization';

export interface Provider {
  id: number;
  providerName: string;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
  organization?: Organization;
}
