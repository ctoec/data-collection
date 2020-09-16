import { Family } from '.';
import { Moment } from 'moment';

export interface IncomeDetermination {
  id: number;
  numberOfPeople?: number;
  income?: number;
  determinationDate?: Moment;
  family: Family;
}
