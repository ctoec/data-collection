import { Child } from '../../client/src/shared/models';
import moment from 'moment';

// Only retrieves enrollment with no exit date
// If you want the last enrollment regardless of whether there's an exit date, use getLastEnrollment
export const getCurrentEnrollment = (child: Child) => {
  const today = moment.utc();
  return (child.enrollments || []).find(
    (enrollment) => !enrollment.exit || enrollment.exit.isSameOrAfter(today)
  );
};
