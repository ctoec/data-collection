import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { Child, User } from '../../entity';
import { NotFoundError } from '../../middleware/error/errors';
import { completeFilterChild } from '../../utils/filterSoftRemoved';

/**
 * Update child record, if user has access
 * @param id
 * @param user
 * @param update
 */
export const updateChild = async (
  id: string,
  user: User,
  update: Partial<Child>
) => {
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

  const updated = getManager().merge(Child, child, {
    ...update,
    updateMetaData: { author: user },
  });
  await getManager().save(updated);
};
