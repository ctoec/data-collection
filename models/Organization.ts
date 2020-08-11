import { FundingSpace, Site } from './';

export interface Organization {
  id: number;
  name: string;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
}
