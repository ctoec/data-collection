import { Family } from '.';
import { Moment } from 'moment';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface IncomeDetermination extends ObjectWithValidationErrors {
  id: number;
  numberOfPeople?: number;
  income?: number;
  determinationDate?: Moment;
  incomeNotDisclosed?: boolean;
  family: Family;
}
