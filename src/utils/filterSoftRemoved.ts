import { Child, Enrollment, Family } from '../entity';

/**
 * Given an array of 'rows' (assumed to be a property of some
 * entity), filter out any objects in those rows that have been
 * soft-deleted.
 * @param entity
 * @param property
 */
export const removeDeletedElements = (rows: any[]) => {
  return rows.filter((row: any) => !row.deletedDate);
};

/**
 * Perform a complete filter of all soft-deleted sub-entities
 * from a given child. Filter's the child's family's income
 * determinations, the child's enrollments, and the fundings of
 * all remaining enrollments.
 * @param child
 */
export const removedDeletedEntitiesFromChild = (child: Child) => {
  if (!child) return undefined;
  child.family.incomeDeterminations = removeDeletedElements(
    child.family.incomeDeterminations || []
  );
  child.enrollments = removeDeletedElements(child.enrollments || []);
  child.enrollments.forEach((e: Enrollment) => {
    e.fundings = removeDeletedElements(e.fundings || []);
  });
  return child;
};
