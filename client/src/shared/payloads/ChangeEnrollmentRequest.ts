import { Moment } from 'moment';
import { ReportingPeriod, Enrollment } from '../models';

export interface ChangeEnrollmentRequest {
  newEnrollment: Enrollment;
  oldEnrollment?: {
    exitDate?: Moment;
    funding?: {
      lastReportingPeriod: ReportingPeriod;
    };
  };
}
