import { Moment } from 'moment';

/**
 * Allows sorting of an array of nested property values within
 * an object (i.e. Enrollments nested within a Child).
 */
export const propertyDateSorter = <T>(
  a: T,
  b: T,
  accessor: (_: T) => Moment | null | undefined,
  inverse?: boolean
) => {
  const aDate = accessor(a);
  const bDate = accessor(b);

  let result = 0;
  if (!aDate) result = 1;
  if (!bDate) result = -1;
  if (aDate?.isSameOrBefore(bDate)) result = 1;
  if (bDate?.isSameOrBefore(aDate)) result = -1;
  if (inverse) result = -1 * result;

  return result;
};
