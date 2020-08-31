import moment from 'moment';
import { isNullOrUndefined } from 'util';

export function parseDateChange(event: React.ChangeEvent<any>) {
  if (isNullOrUndefined(event) || isNullOrUndefined(event.target)) return null;
  return event.target.value
    ? moment.utc(parseInt(event.target.value, 10)).toDate()
    : null;
}
