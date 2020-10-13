import { Enrollment, Organization } from '.';
import { Region } from '../';

export interface Site {
  id: number;
  siteName: string;
  titleI: boolean;
  region: Region;
  facilityCode?: number;
  licenseNumber?: number;
  naeycId?: number;
  registryId?: number;
  organizationId?: number;
  organization: Organization;
  enrollments?: Array<Enrollment>;
}
