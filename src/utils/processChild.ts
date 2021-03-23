import { Child, Enrollment } from '../entity';
import { ValidationError, validate } from 'class-validator';
import { getAllColumnMetadata } from '../template';
import { ObjectWithValidationErrors } from '../../client/src/shared/models';
import { ColumnMetadata } from '../../client/src/shared/models';
import { propertyDateSorter } from './propertyDateSorter';

/**
 * Given a parent object with validation errors that include child object
 * validations, adds validationErrors property to each child object
 * that has its own errors.
 * @param parentObject
 */
function distributeValidationErrorsToSubObjects<
  T extends ObjectWithValidationErrors
>(
  parentObject: T,
  validationErrors: ValidationError[],
  metadata: ColumnMetadata[]
): T {
  if (!parentObject || !validationErrors.length) return parentObject;

  // Add validation errors to the object passed in
  parentObject.validationErrors = validationErrors.map((e) => {
    const { formattedName, propertyName } =
      metadata.find((d) => d.propertyName === e.property) || {};
    return {
      ...e,
      metadata: { formattedName, propertyName } as ColumnMetadata,
    };
  });

  parentObject.validationErrors
    // For each validation error that represents a sub object
    .filter((v: ValidationError) => v.children?.length)
    .forEach((parentValidationError: ValidationError) => {
      let childObject = parentObject[parentValidationError.property];

      if (Array.isArray(childObject)) {
        // If the child object is an array
        // i.e. income determinations or enrollments
        childObject = childObject.map((childObjectItem, i) => {
          const childError = parentValidationError.children.find(
            // Property on parent validation will be the index
            (e) => e.property === `${i}`
          );
          if (!childError) return childObjectItem;
          childObjectItem.validationErrors = childError.children;
          return distributeValidationErrorsToSubObjects(
            childObjectItem,
            childError.children,
            metadata
          );
        });
      } else {
        childObject = distributeValidationErrorsToSubObjects(
          childObject,
          parentValidationError.children,
          metadata
        );
      }

      parentObject[parentValidationError.property] = childObject;
    });

  return parentObject;
}

export async function validateObject<T extends ObjectWithValidationErrors>(
  object: T | undefined
) {
  if (!object) return;

  let validationErrors = await validate(object, {
    validationError: { value: false, target: false },
  });
  const metadata = getAllColumnMetadata();
  return distributeValidationErrorsToSubObjects(
    object,
    validationErrors,
    metadata
  );
}

/**
 * Given an array of 'rows' (assumed to be a property of some
 * entity), filter out any objects in those rows that have been
 * soft-deleted.
 * @param rows
 */
export const removeDeletedElements = (rows?: any[]) => {
  if (!rows) return [];
  return rows.filter((row: any) => !row.deletedDate);
};

/**
 * Perform a complete filter of all soft-deleted sub-entities
 * from a given child. Filter's the child's family's income
 * determinations, the child's enrollments, and the fundings of
 * all remaining enrollments.
 * @param child
 */
export const removeDeletedEntitiesFromChild = (child: Child) => {
  if (!child) return undefined;
  if (child.family) {
    child.family.incomeDeterminations = removeDeletedElements(
      child.family.incomeDeterminations
    );
  }
  child.enrollments = removeDeletedElements(child.enrollments);
  child.enrollments.forEach((e: Enrollment) => {
    e.fundings = removeDeletedElements(e.fundings);
  });
};

/**
 * Sort enrollments, fundings, and income determinations
 * @param child
 */
const sortEntities = (child: Child) => {
  if (!child) return;
  if (child.enrollments) {
    child.enrollments = child.enrollments.sort((enrollmentA, enrollmentB) => {
      if (enrollmentA.fundings) {
        enrollmentA.fundings = enrollmentA.fundings.sort((fundingA, fundingB) =>
          propertyDateSorter(
            fundingA,
            fundingB,
            (f) => f.firstReportingPeriod.period
          )
        );
      }

      return propertyDateSorter(enrollmentA, enrollmentB, (e) => e.entry);
    });
  }

  if (child.family?.incomeDeterminations) {
    child.family.incomeDeterminations = child.family.incomeDeterminations.sort(
      (determinationA, determinationB) =>
        propertyDateSorter(
          determinationA,
          determinationB,
          (d) => d.determinationDate
        )
    );
  }
};

/**
 * Apply all post-processing to a child record:
 * 	- remove deleted entities
 * 	- sort entities by date
 * 	- validate full object tree
 * @param child
 */
export const postProcessChild = async (child: Child) => {
  removeDeletedEntitiesFromChild(child);
  sortEntities(child);
  return validateObject(child);
};
