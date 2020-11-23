import { Moment } from 'moment';
import { Site, Organization } from '.';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  confidentialityAgreedDate?: Moment;
  sites?: Array<Site>;
  organizations?: Array<Organization>;
  accessType?: 'site' | 'organization';
}
