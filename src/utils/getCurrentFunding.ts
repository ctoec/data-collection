import { Child, Enrollment } from '../entity';
import moment from 'moment';

/**
 * Given a child and an enrollment for that child, determines the most
 * current, up-to-date funding information for that enrollment.
 * @param source
 */
export const getCurrentFunding = (source: {
  child?: Child;
  enrollment?: Enrollment;
}) => {
  const { enrollment, child } = source;

  if (!enrollment && !child) return;

  const today = moment.utc();
  const currentEnrollment = (child.enrollments || []).find(
    (enrollment) => !enrollment.exit || enrollment.exit.isSameOrAfter(today)
  );

  const _enrollment = enrollment || (child ? currentEnrollment : undefined);

  if (!_enrollment) return;

  return (_enrollment.fundings || []).find(
    (funding) =>
      !funding.lastReportingPeriod ||
      funding.lastReportingPeriod.periodEnd.isSameOrAfter(today)
  );
};
