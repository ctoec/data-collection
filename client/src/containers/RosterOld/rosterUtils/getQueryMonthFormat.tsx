import { Moment } from 'moment';
import { QUERY_STRING_MONTH_FORMAT } from './constants';

/**
 * Get month param in query string month format
 * @param month
 */
export const getQueryMonthFormat = (month?: Moment) => {
  if (!month || !month.isValid()) return undefined;
  return month.format(QUERY_STRING_MONTH_FORMAT);
};
