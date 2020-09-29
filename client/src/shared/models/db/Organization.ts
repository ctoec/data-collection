import { ChildUniqueIdType, FundingSpace, Site } from '..';

export interface Organization {
  id: number;
  providerName: string;
  parentOrganization?: Organization;
  childOrganizations?: Organization[];
  sites?: Site[];
  fundingSpaces?: FundingSpace[];
  childUniqueIdType?: ChildUniqueIdType;
  c4kProviderId?: string;
}
