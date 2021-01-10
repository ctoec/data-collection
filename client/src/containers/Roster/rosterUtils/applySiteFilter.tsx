import { Child } from '../../../shared/models';
import { getCurrentEnrollment } from '../../../utils/models';
import { getLastEnrollment } from '../../../utils/models/getLastEnrollment';

/**
 * Does client-side data filtering, by site and/or month
 * @param allChildren
 * @param site
 * @param month
 */
export function applySiteFilter(
  allChildren: Child[] | undefined,
  site?: string,
  withdrawn?: boolean
) {
  if (!allChildren) return;

  let filteredChildren: Child[] = allChildren;
  if (site) {
    const getEnrollmentFunc = withdrawn
      ? getLastEnrollment
      : getCurrentEnrollment;
    filteredChildren = filteredChildren.filter(
      (child) => getEnrollmentFunc(child)?.site?.id.toString() === site
    );
  }
  return filteredChildren;
}
