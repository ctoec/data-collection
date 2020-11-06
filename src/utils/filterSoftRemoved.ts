import { Child, Enrollment, Family } from '../entity';

/**
 * Given an entity and an object property on that entity, filter
 * out all instances of the property in the entity's array that
 * have a soft-deleted date set in the system.
 * @param entity
 * @param property
 */
export const filterXFromY = (entity: Object, property: string) => {
  if (!entity || !property || !entity.hasOwnProperty(property))
    return undefined;
  if (!entity[property]) return entity;
  const filteredProp = entity[property].filter(
    (elt: any) => elt.deletedDate === null
  );
  entity[property] = filteredProp;
  return entity;
};

/**
 * Perform a complete filter of all soft-deleted sub-entities
 * from a given child. Filter's the child's family's income
 * determinations, the child's enrollments, and the fundings of
 * all remaining enrollments.
 * @param child
 */
export const completeFilterChild = (child: Child) => {
  if (!child) return undefined;
  child.family = filterXFromY(child.family, 'incomeDeterminations') as Family;
  child = filterXFromY(child, 'enrollments') as Child;
  child.enrollments = child.enrollments.map(
    (e) => filterXFromY(e, 'fundings') as Enrollment
  );
  return child;
};
