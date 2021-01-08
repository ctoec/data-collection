import { Child } from '../../../shared/models';

export const filterChildrenByWithdrawn = (children: Child[]) => {
  return children.reduce(
    (filteredChildren, child) => {
      if (
        child.enrollments?.length &&
        child.enrollments?.every((enrollment) => !!enrollment.exit)
      ) {
        filteredChildren.withdrawn.push(child);
      } else {
        filteredChildren.active.push(child);
      }
      return filteredChildren;
    },
    { active: [] as Child[], withdrawn: [] as Child[] }
  );
};
