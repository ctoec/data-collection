import { Organization, User } from '.';

export interface OrganizationPermission {
  id: number;
  user: User;
  organization: Organization;
}
