import { Child } from '../../shared/models';
import moment from 'moment';
import { getCurrentEnrollment } from './getCurrentEnrollment';

export const getCurrentFunding = (child: Child) => {
  const enrollment = getCurrentEnrollment(child);

  if (!enrollment) return;

  const today = moment.utc();
  return (enrollment.fundings || []).find(
    (funding) =>
      !funding.lastReportingPeriod ||
      funding.lastReportingPeriod.periodEnd.isSameOrAfter(today)
  );
};
