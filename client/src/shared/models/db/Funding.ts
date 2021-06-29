import { Moment } from 'moment';
import { Enrollment, FundingSpace } from '.';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Funding extends ObjectWithValidationErrors {
  id: number;
  enrollment: Enrollment;
  fundingSpace?: FundingSpace;
	startDate?: Moment;
	endDate?: Moment;
}
