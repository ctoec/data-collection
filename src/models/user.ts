import { OrganizationPermission } from './organization';
import { Site, SitePermission } from './site';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  orgPermissions?: Array<OrganizationPermission>;
  sitePermissions?: Array<SitePermission>;
  sites?: Array<Site>;
}
