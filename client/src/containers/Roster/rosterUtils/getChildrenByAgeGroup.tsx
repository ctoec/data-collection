import idx from 'idx';
import { AgeGroup, Child } from '../../../shared/models';
import { NoAgeGroup, ChildrenByAgeGroup } from './constants';

/**
 * Returns a dict of filtered children, with age groups as keys.
 * @param filteredChildren
 */
export function getChildrenByAgeGroup(
  filteredChildren: Child[]
): ChildrenByAgeGroup {
  const childrenByAgeGroup: ChildrenByAgeGroup = {};
  // Filter all children into an object, keyed by age group
  // with array of children for that agegroup as value
  filteredChildren.reduce((_byAgeGroup, _child) => {
    const ageGroup = idx(_child, (_) => _.enrollments[0].ageGroup) || undefined;
    if (ageGroup) {
      if (!!!_byAgeGroup[ageGroup]) {
        _byAgeGroup[ageGroup] = [_child];
      } else {
        // _byAgeGroup[ageGroup] is not _actually_ possibly undefined; checked in above if
        _byAgeGroup[ageGroup]?.push(_child);
      }
    } else {
      if (!_byAgeGroup[NoAgeGroup]) {
        _byAgeGroup[NoAgeGroup] = [_child];
      } else {
        _byAgeGroup[NoAgeGroup]?.push(_child);
      }
    }
    return _byAgeGroup;
  }, childrenByAgeGroup);

  // Sort object to have consistent section ordering, where NoAgeGroup will always
  // be first if it exists, followed by AgeGroups as they are defined in the enum
  const sortedByAgeGroup: ChildrenByAgeGroup = {};
  if (
    childrenByAgeGroup[NoAgeGroup] &&
    childrenByAgeGroup[NoAgeGroup]?.length
  ) {
    sortedByAgeGroup[NoAgeGroup] = childrenByAgeGroup[NoAgeGroup];
  }
  Object.values(AgeGroup).forEach((ageGroup) => {
    if (childrenByAgeGroup[ageGroup] && childrenByAgeGroup[ageGroup]?.length) {
      sortedByAgeGroup[ageGroup] = childrenByAgeGroup[ageGroup];
    }
  });
  return sortedByAgeGroup;
}
