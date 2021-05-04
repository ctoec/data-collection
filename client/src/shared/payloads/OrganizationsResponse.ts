import { Moment } from 'moment';
import { FundingSpace } from '../models/db/FundingSpace';
import { Site } from '../models/db/Site';

export interface OrganizationSummary {
  id: number;
  providerName: string;
  communityId?: number;
  uniqueIdType: string;
  sites: Site[];
  fundingSpaces: FundingSpace[];
}
