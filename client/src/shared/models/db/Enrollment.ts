import { Child, Funding, Site } from '.';
import { Moment } from 'moment';
import { AgeGroup } from '../';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';
import { CareModel } from '../CareModel';

export interface Enrollment extends ObjectWithValidationErrors {
  id: number;
  child: Child;
  site?: Site;
  model?: CareModel;
  ageGroup?: AgeGroup;
  entry?: Moment;
  exit?: Moment;
  exitReason?: string;
  fundings?: Array<Funding>;
}
