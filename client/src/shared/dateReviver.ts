import moment from 'moment';

/**
 * Shared util for automatically parsing strings in the specified
 * date format as a moment object in both the front and back end.
 * @param _
 * @param value
 */
export const dateReviver = (_: any, value: string) => {
  if (typeof value === 'string') {
    const parsedDate = moment.utc(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
    if (parsedDate.isValid()) return parsedDate;
  }
  return value;
};
