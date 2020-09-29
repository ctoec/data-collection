import { Enrollment, Provider } from '.';
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
  provider: Provider;
  enrollments?: Array<Enrollment>;
}
