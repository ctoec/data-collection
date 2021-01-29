import { User, Child } from '../../entity';
import { EntityManager, In } from 'typeorm';
import { removeDeletedElements } from '../../utils/filterSoftRemoved';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';

/**
 * Removes existing child records for the given user, to prepare for uploading a new
 * enrollment report.
 *
 * User can optionally supply a list of site ids to restrict data clean up to only those
 * site's data. If no site ids are supplied, then all data the user has access to will
 * be removed.
 */
export const removeExistingEnrollmentDataForUser = async (
  transaction: EntityManager,
  user: User,
  siteIdsToReplace?: string[]
) => {
  const readAccessibleOrgIds = await getReadAccessibleOrgIds(user);
  let allChildren = await transaction.find(Child, {
    relations: [
      'enrollments',
      'enrollments.fundings',
      'family',
      'family.incomeDeterminations',
    ],
    where: { organization: { id: In(readAccessibleOrgIds) } },
  });
  allChildren.forEach((c) => {
    c.enrollments = removeDeletedElements(c.enrollments || []);
  });
  if (!allChildren || !allChildren.length) return;

  const childrenToDelete =
    // If specific site ids are supplied in API call, remove data for those sites
    siteIdsToReplace?.length
      ? allChildren.filter(
          (child) =>
            child.enrollments?.length &&
            child.enrollments.some((e) =>
              siteIdsToReplace.includes(`${e.siteId}`)
            )
        )
      : user.sitePermissions?.length
      ? // If user is site-level user, only remove data for their sites
        allChildren.filter(
          (child) =>
            child.enrollments?.length &&
            child.enrollments?.some((e) => user.siteIds.includes(e.siteId))
        )
      : // Otherwise, remove all children for orgs
        allChildren;

  await transaction.softRemove(childrenToDelete);
  await transaction.softRemove(childrenToDelete.map((child) => child.family));
};
