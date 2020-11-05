import { getManager } from 'typeorm';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { Family, Child, User } from '../../entity';

/**
 * Creates a child from a POST request body.
 * Also, creates a family if one does not exist.
 * @param _child
 */
export const createChild = async (_child: Child, user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  if (
    !readOrgIds.length ||
    !_child.organization ||
    !readOrgIds.includes(`${_child.organization.id}`)
  ) {
    console.error(
      'User does not have permission to create the child row supplied'
    );
    throw new Error('Child creation request denied');
  }

  // TODO: make family optional on the child
  // (to enable family lookup when adding new child)
  // and stop creating it here
  if (!_child.family) {
    const organization = _child.organization;
    const family = await getManager().save(
      getManager().create(Family, { organization })
    );
    _child.family = family;
  }

  const newChild = getManager().create(Child, {
    ..._child,
    updateMetaData: {
      author: user,
    },
  });
  return getManager().save(newChild);
};
