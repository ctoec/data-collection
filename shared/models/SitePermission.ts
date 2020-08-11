import { Site, User } from '.';

export interface SitePermission {
  id: number;
  user: User;
  site: Site;
}
