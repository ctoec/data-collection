import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { User, Child } from '../../entity';
import { NotFoundError } from '../../middleware/error/errors';
import { completeFilterChild } from '../../utils/filterSoftRemoved';

/**
 * Delete child record, if user has access
 * @param id
 * @param user
 */
export const deleteChild = async (id: string, user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  let child = await getManager().findOne(Child, id, {
    where: { organization: { id: In(readOrgIds) } },
  });
  child = completeFilterChild(child);

  if (!child) {
    console.warn(
      'Child either does not exist, or user does not have permission to modify'
    );
    throw new NotFoundError();
  }

  await getManager().softRemove(child);
};
