import { Moment } from 'moment';

export interface WithdrawRequest {
  exit: Moment;
  exitReason: string;
  funding?: {
    endDate: Moment;
  };
}
