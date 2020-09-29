import { Site, Provider, Organization } from '.';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  sites?: Array<Site>;
  providers?: Array<Provider>;
  organizations?: Array<Organization>;
}
