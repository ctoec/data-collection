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
  const currentEnrollment =
    enrollment ??
    (child.enrollments || []).find(
      (enrollment) => !enrollment.exit || enrollment.exit.isSameOrAfter(today)
    );

  if (!currentEnrollment) return;

  return (currentEnrollment.fundings || []).find(
    (funding) => !funding.endDate || funding.endDate.isSameOrAfter(today)
  );
};
