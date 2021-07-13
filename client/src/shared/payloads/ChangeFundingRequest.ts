import { Moment } from 'moment';
import { Funding } from '../models';

export interface ChangeFundingRequest {
  newFunding?: Funding;
  oldFunding?: {
    endDate: Moment;
  };
}
