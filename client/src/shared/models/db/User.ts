import { Site, Organization } from '.';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  topLevelOrganization?: Organization;
  sites?: Site[];
  organizations?: Organization[];
}
