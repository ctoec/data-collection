import { FormStatusProps, TObjectDriller } from '@ctoec/component-library';
import { ValidationError } from 'class-validator';
import {
  EnrichedValidationError,
  ObjectWithValidationErrors,
} from '../shared/models/ObjectWithValidationErrors';
import { capitalizeFirstLetter } from './formatters/sentenceCase';

const getIsRequiredMessage = (fieldName: string) =>
  `${fieldName} is required for OEC reporting.`;

function getValidationErrorMessage(validationError: EnrichedValidationError) {
  // Constraints i.e. { isNotEmpty: 'Error message from the backend about the field being empty' }
  const { constraints } = validationError || {};
  const fieldName = capitalizeFirstLetter(
    validationError?.metadata?.formattedName || 'Field'
  );
  // Use the is required error message as a default to make typescript happy
  // There is probably not acctually a case where there is an error but no constraints
  // unless someone writes a custom validation and forgets
  if (!constraints) return getIsRequiredMessage(fieldName);

  return Object.keys(constraints).reduce((prev, current) => {
    // Returns a string of sentences, one for each validation error
    let appendMessage = constraints[current];
    if (current === 'isNotEmpty') {
      appendMessage = getIsRequiredMessage(fieldName);
    }
    if (!prev) return appendMessage;
    return `${prev} ${appendMessage}`;
  }, '');
}

/**
 * Wrapper function around getValidationStatusForField that passes in option
 * { message: undefined } to ovverride default behavior of showing error message
 * so that fieldset only shows one message for the whole set.
 */
export function getValidationStatusForFieldInFieldset<
  T extends ObjectWithValidationErrors
>(
  objectDriller: TObjectDriller<NonNullable<T>>,
  path: string,
  _: any // TODO: clean this up -- no longer used now that property names come from validation error metadata
): FormStatusProps | undefined {
  // TODO: do we actually want to do this?
  // Are there any cases where we want to show the error for each field in a fieldset?
  return getValidationStatusForField(objectDriller, path, _, {
    message: undefined,
  });
}

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
 * @param fieldProps
 * @param options
 */
export function getValidationStatusForField<
  T extends ObjectWithValidationErrors
>(
  objectDriller: TObjectDriller<NonNullable<T>>,
  path: string,
  _: any, // TODO: clean this up -- no longer user now that property names come from validation error metadata (but still expected by FormField status)
  options?: ValidationStatusOptions
): FormStatusProps | undefined {
  console.log('getValidationStatusForField executing...');
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

  return {
    type: 'error',
    id: `status-${field}`,
    message: getValidationErrorMessage(validationError),
    ...options,
  };
}

/**
 * The fieldset passes the data to the validation function.  This takes
 * an object with validation errors or an array of objects with validation errors
 * and an array of non-nested properties to check for errors on that object(s).
 * This func takes any of the form status props as options that will override
 * the default type, id, and message.
 * @param data
 * @param fields
 * @param options
 */
export function getValidationStatusForFields<
  T extends ObjectWithValidationErrors
>(
  data: T | T[],
  fields: string[],
  options?: ValidationStatusOptions
): FormStatusProps | undefined {
  if (Array.isArray(data)) {
    // If you want to check an array of enrollments or income dets or children
    const allErrors = data.map((d: T) =>
      getValidationStatusForFields(d, fields, options)
    );
    const anError = allErrors.find((e) => !!e);
    // To determine if any of the array items has an error
    // Useful in getting overall status for enrollment forms
    return anError || undefined;
  }
  if (!data || !data.validationErrors) return;
  const validationErrors = data.validationErrors.filter((v) =>
    fields.includes(v.property)
  );
  if (!validationErrors.length) return;
  const message = validationErrors.reduce((prev, current) => {
    // Result from get validation error message is a string of sentences.
    // This chains those together.
    // Override this default with a custom message in options if you don't want this.
    const newMessage = getValidationErrorMessage(current);
    if (!prev) return newMessage;
    return `${prev} ${newMessage}`;
  }, '');

  return {
    type: 'error',
    id: `status-${fields.join('-')}`,
    message,
    ...options,
  };
}
