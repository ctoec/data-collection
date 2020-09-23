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
>(parentObject?: T | T[]): T | T[] | undefined {
  // If it's an array, return an array
  if (Array.isArray(parentObject)) {
    return parentObject.map((p: T) => distributeValidationErrorsToSubObjects(p)) as T[]
  }

  if (!parentObject?.validationErrors) return parentObject;
  const copiedParent = JSON.parse(JSON.stringify(parentObject));
  console.log(copiedParent, copiedParent.validationErrors)


  copiedParent.validationErrors
    .filter((v: ValidationError) => v.children?.length)
    .forEach((v: ValidationError) => {
      let childObject = copiedParent[v.property];
      childObject.validationErrors = [...v.children];
      distributeValidationErrorsToSubObjects(childObject);
      copiedParent[v.property] = childObject;
    });

  return copiedParent;
}
