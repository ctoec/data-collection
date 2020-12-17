import { ValidationError, validate } from 'class-validator';
import { getAllColumnMetadata } from '../template';
import { ObjectWithValidationErrors } from '../../client/src/shared/models';
import { ColumnMetadata } from '../../client/src/shared/models';

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
