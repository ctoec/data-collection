import { FormStatusProps, ObjectDriller } from '@ctoec/component-library';
import { ValidationError } from 'class-validator';
import { ObjectWithValidationErrors } from '../shared/models/ObjectWithValidationErrors';

export type ValidationStatusOptions = {
  type?: FormStatusProps['type'];
  id?: string;
  message?: string;
};

/**
 * The form field passes object driller and path to the validation function,
 * so this func can be used on its own to return a status if there is an error.
 * This func takes any of the form status props as options that will override
 * the default type, id, and message.
 * @param objectDriller
 * @param path
 * @param options
 */
export function getValidationStatusForField<
  T extends ObjectWithValidationErrors
>(
  objectDriller: ObjectDriller<T>,
  path: string,
  options?: ValidationStatusOptions
): FormStatusProps | undefined {
  const splitPath = path.split('.');
  const field = splitPath.pop();

  let _drilledObject: any = objectDriller;
  if (splitPath.length) {
    splitPath.forEach((p) => (_drilledObject = _drilledObject.at(p)));
  }
  const _object: any & ObjectWithValidationErrors = _drilledObject.value;

  if (!_object || !_object.validationErrors) return;
  const validationError: ValidationError = _object.validationErrors.find(
    (v: ValidationError) => v.property === field
  );
  if (!validationError) return;
  const { constraints } = validationError;
  return {
    type: 'warning',
    id: `status-${field}`,
    message: constraints ? Object.values(constraints).join(', ') : undefined,
    ...options,
  };
}

/**
 * The fieldset passes the data to the validation function.  This takes
 * an object with validation errors and an array of non-nested properties
 * that fall within that fieldset to check for errors.
 * This func takes any of the form status props as options that will override
 * the default type, id, and message.
 * @param data
 * @param fields
 * @param options
 */
export function getValidationStatusForFieldset<
  T extends ObjectWithValidationErrors
>(
  data: T,
  fields: string[],
  options?: ValidationStatusOptions
): FormStatusProps | undefined {
  if (!data || !data.validationErrors) return;
  const validationErrors = data.validationErrors.filter((v) =>
    fields.includes(v.property)
  );
  if (!validationErrors.length) return;
  const message = validationErrors
    .map((v: ValidationError) =>
      v.constraints ? Object.values(v.constraints).join(', ') : ''
    )
    .join(', ');

  return {
    type: 'warning',
    id: `status-${fields.join('-')}`,
    message,
    ...options,
  };
}

/**
 * Given a parent object with validation errors that include child object
 * validations, adds validationErrors property to each child object
 * that has its own errors.
 * @param parentObject
 */
export function distributeValidationErrorsToSubObjects<
  T extends ObjectWithValidationErrors
>(parentObject?: T): T | undefined {
  if (!parentObject || !parentObject.validationErrors) return parentObject;
  const copiedParent = JSON.parse(JSON.stringify(parentObject));

  copiedParent.validationErrors
    .filter((v: ValidationError) => v.children && v.children.length)
    .forEach((v: ValidationError) => {
      let childObject = copiedParent[v.property];
      childObject.validationErrors = [...v.children];
      distributeValidationErrorsToSubObjects(childObject);
      copiedParent[v.property] = childObject;
    });

  return copiedParent;
}
