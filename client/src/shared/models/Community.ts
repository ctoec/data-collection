import { Organization } from '.';

export interface Community {
  id: number;
  name: string;
  organizations?: Array<Organization>;
}
