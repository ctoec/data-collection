import { getManager } from 'typeorm';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { Child, Family, User } from '../../entity';
import { validateObject } from '../../utils/validateObject';
import { getAllColumnMetadata, SECTIONS } from '../../template';

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

  const newChild = getManager().create(Child, {
    ..._child,
    updateMetaData: {
      author: user,
    },
  });

  const validatedChild = await validateObject(newChild);
  const identifierSectionMetadata = getAllColumnMetadata()
    .filter((m) => m.section === SECTIONS.CHILD_IDENTIFIER)
    .map((m) => m.propertyName);
  const saveBlockingErrors = validatedChild.validationErrors?.some((v) =>
    identifierSectionMetadata.includes(v.property)
  );
  if (saveBlockingErrors) {
    // Return without saving
    return validatedChild;
  }

  // TODO: create family in family address section instead
  // (to enable family lookup when adding new child)
  // and stop creating it here
  if (!_child.family) {
    const organization = _child.organization;
    const family = await getManager().save(
      getManager().create(Family, { organization })
    );
    _child.family = family;
  }

  return await getManager().save(newChild);
};
