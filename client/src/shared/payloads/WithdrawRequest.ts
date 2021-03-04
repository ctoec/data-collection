import { Moment } from 'moment';
import { ReportingPeriod } from '../models';

export interface WithdrawRequest {
  exit: Moment;
  exitReason: string;
  funding?: {
    lastReportingPeriod: ReportingPeriod;
  };
}
