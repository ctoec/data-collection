import { FundingSpace } from './funding';
import { Site } from './site';
import { User } from './user';

export interface Organization {
  id: number;
  name: string;
  sites?: Array<Site>;
  fundingSpaces?: Array<FundingSpace>;
}

export interface OrganizationPermission {
  organizationId: number;
  organization?: Organization;
  id: number;
  userId: number;
  user?: User;
}
