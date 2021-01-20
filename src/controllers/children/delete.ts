import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { User, Child } from '../../entity';
import { NotFoundError } from '../../middleware/error/errors';

/**
 * Delete child record, if user has access
 * @param id
 * @param user
 */
export const deleteChild = async (id: string, user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  let child = await getManager().findOne(Child, id, {
    // fetch family + income dets, and enrollment + fundings so they'll be soft removed
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.fundings',
    ],
    where: { organization: { id: In(readOrgIds) } },
  });

  if (!child) {
    console.warn(
      'Child either does not exist, or user does not have permission to modify'
    );
    throw new NotFoundError();
  }

  await getManager().softRemove(child);
  // For now, also remove family since we have a 1-to-1 child-family relationship
  // TODO: remove this when we do family look ups
  await getManager().softRemove(child.family);
};
