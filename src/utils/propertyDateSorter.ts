import { Moment } from 'moment';

/**
 * Allows sorting of an array of nested property values within
 * an object (i.e. Enrollments nested within a Child).
 */
export const propertyDateSorter = <T>(
  a: T,
  b: T,
  accessor: (_: T) => Moment | null | undefined
) => {
  const aDate = accessor(a);
  const bDate = accessor(b);

  if (!aDate) return 1;
  if (!bDate) return -1;
  if (aDate.isSameOrBefore(bDate)) return 1;
  if (bDate.isSameOrBefore(aDate)) return -1;
  return 0;
};
