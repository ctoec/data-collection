import { OrganizationPermission, Site, SitePermission } from '.';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  sitesIds?: Array<number>;
  organizationIds?: Array<number>;
}
