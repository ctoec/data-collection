import { Enrollment } from '../../shared/models';
import { propertyDateSorter } from '../dateSorter';

export const getLastFunding = (enrollment: Enrollment) => {
  if (!enrollment) return undefined;
  return (enrollment.fundings || []).sort((a, b) =>
    propertyDateSorter(a, b, (f) => f.startDate, true)
  )[0];
};
