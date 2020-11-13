import { FundingSpace, Site } from '.';
import { UniqueIdType } from '../UniqueIdType';

export interface Organization {
  id: number;
  providerName: string;
  uniqueIdType: UniqueIdType;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
  communityId?: number;
}
