import { Child } from '../../shared/models';
import { propertyDateSorter } from '../dateSorter';

export const getLastEnrollment = (child: Child) => {
  return (child.enrollments || []).sort((a, b) =>
    propertyDateSorter(a, b, (d) => d.exit, true)
  )[0];
};
