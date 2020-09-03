import { Moment } from 'moment';
import { ReportingPeriod } from '../models';

export interface Withdraw {
  exitDate: Moment;
  exitReason: string;
  funding?: {
    lastReportingPeriod: ReportingPeriod;
  };
}
