import { Child } from '../../shared/models';
import moment from 'moment';

export const getCurrentEnrollment = (child: Child) => {
  const today = moment.utc();
  return (child.enrollments || []).find(
    (enrollment) => !enrollment.exit || enrollment.exit.isSameOrAfter(today)
  );
};
