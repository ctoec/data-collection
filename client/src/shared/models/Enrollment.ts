import { AgeGroup, Child, Funding, Site } from '.';
import { Moment } from 'moment';

export interface Enrollment {
  id: number;
  child: Child;
  site: Site;
  ageGroup?: AgeGroup;
  entry?: Moment;
  exit?: Moment;
  exitReason?: string;
  fundings?: Array<Funding>;
}
