import { Family } from './';

export interface IncomeDetermination {
  id: number;
  numberOfPeople?: number;
  income?: number;
  determinationDate?: Date;
  family: Family;
}
