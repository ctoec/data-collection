import { Moment } from 'moment';
import { Enrollment } from '../models';

export interface ChangeEnrollmentRequest {
  newEnrollment: Enrollment;
  oldEnrollment?: {
    exitDate?: Moment;
    funding?: {
			endDate: Moment;
    };
  };
}
