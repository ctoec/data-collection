import { Moment } from 'moment';
import { ReportingPeriod } from '../models';

export interface Withdraw {
  exit: Moment;
  exitReason: string;
  funding?: {
    lastReportingPeriod: ReportingPeriod;
  };
}
