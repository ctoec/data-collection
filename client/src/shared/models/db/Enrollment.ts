import { Child, Funding, Site } from '.';
import { Moment } from 'moment';
import { AgeGroup } from '../';

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
