import { ValidationError } from "class-validator";
import { ObjectWithValidationErrors } from '../../client/src/shared/models'

/**
 * Given a parent object with validation errors that include child object
 * validations, adds validationErrors property to each child object
 * that has its own errors.
 * @param parentObject
 */
export function distributeValidationErrorsToSubObjects<
  T extends ObjectWithValidationErrors
>(parentObject?: T): T | undefined {
  if (!parentObject?.validationErrors) return parentObject;
  const copiedParent = JSON.parse(JSON.stringify(parentObject));

  copiedParent.validationErrors
    .filter((v: ValidationError) => v.children?.length)
    .forEach((parentValidationError: ValidationError) => {
      let childObject = copiedParent[parentValidationError.property];
      if (Array.isArray(childObject)) {
        // i.e. income determinations or enrollments
        childObject = childObject.map((childObjectItem, i) => {
          const childError = parentValidationError.children.find(e => e.property === `${i}`)
          childObjectItem.validationErrors = childError.children;
          return distributeValidationErrorsToSubObjects(childObjectItem);
        })
      } else {
        childObject.validationErrors = [...parentValidationError.children];
        childObject = distributeValidationErrorsToSubObjects(childObject);
      }
      copiedParent[parentValidationError.property] = childObject;
    });

  return copiedParent;
}
