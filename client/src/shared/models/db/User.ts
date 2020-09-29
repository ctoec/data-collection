import { Site, Provider } from '.';

export interface User {
  id: number;
  wingedKeysId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  sites?: Array<Site>;
  providers?: Array<Provider>;
}
