import { Enrollment } from '../../shared/models';
import { propertyDateSorter } from '../dateSorter';

export const getLastFunding = (enrollment: Enrollment) => {
  if (!enrollment) return undefined;
  return (enrollment.fundings || []).sort((a, b) =>
    propertyDateSorter(a, b, (d) => d.firstReportingPeriod?.period, true)
  )[0];
};
