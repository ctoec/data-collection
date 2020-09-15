import { Child, Funding, Site } from '.';
import { Moment } from 'moment';
import { AgeGroup } from '../';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Enrollment extends ObjectWithValidationErrors {
  id: number;
  child: Child;
  site: Site;
  ageGroup?: AgeGroup;
  entry?: Moment;
  exit?: Moment;
  exitReason?: string;
  fundings?: Array<Funding>;
}
