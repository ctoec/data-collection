import { User, Child } from '../../entity';
import { EntityManager, In } from 'typeorm';

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
  const allChildren = await transaction.find(Child, {
    relations: ['enrollments'],
    where: { organization: { id: In(user.organizationIds) } },
  });
  if (!allChildren || !allChildren.length) return;

  const childrenToDelete =
    siteIdsToReplace && siteIdsToReplace.length
      ? allChildren.filter(
          (child) =>
            !child.enrollments ||
            !child.enrollments.length ||
            child.enrollments.some((e) =>
              siteIdsToReplace.includes(`${e.siteId}`)
            )
        )
      : allChildren;

  await transaction.delete(Child, childrenToDelete);
};
