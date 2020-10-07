import { Child, Enrollment } from '../../shared/models';
import moment from 'moment';
import { getCurrentEnrollment } from './getCurrentEnrollment';

export const getCurrentFunding = (source: {
  child?: Child;
  enrollment?: Enrollment;
}) => {
  const { enrollment, child } = source;

  if (!enrollment && !child) return;

  const _enrollment =
    enrollment || (child ? getCurrentEnrollment(child) : undefined);

  if (!_enrollment) return;

  const today = moment.utc();
  return (_enrollment.fundings || []).find(
    (funding) =>
      !funding.lastReportingPeriod ||
      funding.lastReportingPeriod.periodEnd.isSameOrAfter(today)
  );
};
