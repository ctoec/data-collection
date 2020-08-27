import { Moment } from 'moment';
import {
  AgeGroup,
  ReportingPeriod,
  Site,
  FundingSpace,
  Enrollment,
} from '../models';

export interface ChangeEnrollment {
  newEnrollment: Enrollment;
  oldEnrollment?: {
    exitDate?: Moment;
    funding?: {
      lastReportingPeriod: ReportingPeriod;
    };
  };
}
