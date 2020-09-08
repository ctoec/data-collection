import { Moment } from 'moment';
import { ReportingPeriod, Enrollment } from '../models';

export interface ChangeEnrollment {
  newEnrollment: Enrollment;
  oldEnrollment?: {
    exitDate?: Moment;
    funding?: {
      lastReportingPeriod: ReportingPeriod;
    };
  };
}
