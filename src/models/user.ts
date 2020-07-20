import { OrganizationPermission } from './organizationPermission';
import { Site } from './site';
import { SitePermission } from './sitePermission';

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