import { Enrollment } from './enrollment';
import { Organization } from './organization';
import { Region } from './region';
import { User } from './user';

export interface Site {
  id: number;
  name: string;
  titleI: boolean;
  region: Region;
  organizationId: number;
  organization?: Organization;
  facilityCode?: number;
  licenseNumber?: number;
  naeycId?: number;
  registryId?: number;
  enrollments?: Array<Enrollment>;
}

export interface SitePermission {
  siteId: number;
  site?: Site;
  id: number;
  userId: number;
  user?: User;
}
