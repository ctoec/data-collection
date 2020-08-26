import { AgeGroup, Child, Funding, Site } from '.';
import { Moment } from 'moment';

export interface Enrollment {
  id: number;
  child: Child;
  childId: string;
  site: Site;
  siteId: number;
  ageGroup?: AgeGroup;
  entry?: Moment;
  exit?: Moment;
  exitReason?: string;
  fundings?: Array<Funding>;
}
