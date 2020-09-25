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
>(parentObject: T, validationErrors: ValidationError[]): T {
  if (!parentObject || !validationErrors.length) return parentObject;
  const copiedParent = JSON.parse(JSON.stringify(parentObject));
  copiedParent.validationErrors = validationErrors;

  copiedParent.validationErrors
    .filter((v: ValidationError) => v.children?.length)
    .forEach((parentValidationError: ValidationError) => {
      let childObject = copiedParent[parentValidationError.property];
      if (Array.isArray(childObject)) {
        // i.e. income determinations or enrollments
        childObject = childObject.map((childObjectItem, i) => {
          const childError = parentValidationError.children.find(e => e.property === `${i}`)
          childObjectItem.validationErrors = childError.children;
          return distributeValidationErrorsToSubObjects(childObjectItem, childError.children);
        })
      } else {
        childObject = distributeValidationErrorsToSubObjects(childObject, parentValidationError.children);
      }
      copiedParent[parentValidationError.property] = childObject;
    });

  return copiedParent;
}