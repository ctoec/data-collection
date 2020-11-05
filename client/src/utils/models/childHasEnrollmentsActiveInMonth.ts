import moment, { Moment } from 'moment';
import { Child } from '../../shared/models';

export function childHasEnrollmentsActiveInMonth(child: Child, month: Moment) {
  // Exit is after first of month
  const firstOfMonth = moment(month).startOf('month');
  // Entry is before last of month
  const lastOfMonth = moment(month).endOf('month');

  const activeEnrollmentsInMonth = child.enrollments?.filter(
    (e) =>
      e.entry?.isBefore(lastOfMonth) &&
      (!e.exit || e.exit?.isSameOrAfter(firstOfMonth))
  );

  return !!activeEnrollmentsInMonth?.length;
}
