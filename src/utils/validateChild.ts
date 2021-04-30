import { ValidationError, validate } from 'class-validator';
import { Child } from '../entity';
import { getAllColumnMetadata } from '../template';
import { ColumnMetadata } from '../../client/src/shared/models';

/**
 * Given a parent object with validation errors that include child object
 * validations, adds validationErrors property to each child object
 * that has its own errors.
 * @param parentObject
 */
function distributeValidationErrorsToSubObjects(
  parentObject: Child,
  validationErrors: ValidationError[],
  metadata: ColumnMetadata[]
) {
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

export async function validateChild(child: Child) {
  const validationErrors = await validate(child, {
    validationError: { value: false, target: false },
  });
  const metadata = getAllColumnMetadata();
  return distributeValidationErrorsToSubObjects(
    child,
    validationErrors,
    metadata
  );
}
