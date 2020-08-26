import { Moment } from 'moment';
import { AgeGroup, ReportingPeriod, Site, FundingSpace } from '../models';

export interface ChangeEnrollment {
  newEnrollment: {
    site: Site;
    startDate: Moment;
    ageGroup: AgeGroup;
    funding?: {
      fundingSpace: FundingSpace;
      firstReportingPeriod: ReportingPeriod;
    };
  };
  oldEnrollment?: {
    exitDate?: Moment;
    funding?: {
      lastReportingPeriod: ReportingPeriod;
    };
  };
}
