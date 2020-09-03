import moment, { Moment } from 'moment';

export default function dateFormatter(
  date: string | null | Date | Moment | undefined,
  opts?: { long?: boolean }
) {
  opts = opts || {};
  if (!date) {
    return '';
  }

  if (opts.long) return moment.utc(date).format('MMMM DD, YYYY');

  return moment.utc(date).format('MM/DD/YYYY');
}
