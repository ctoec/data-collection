import React from 'react';
import { FormStatusProps, TObjectDriller } from '@ctoec/component-library';
import { ValidationError } from 'class-validator';
import { ReactNode } from 'react';
import { ObjectWithValidationErrors } from '../shared/models/ObjectWithValidationErrors';

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
  fieldProps: any & { label: string }
): FormStatusProps | undefined {
  return getValidationStatusForField(objectDriller, path, fieldProps, {
    message: undefined,
  });
}

export type ValidationStatusOptions = {
  type?: FormStatusProps['type'];
  id?: string;
  message?: string;
};

export function drillReactNodeForText(inputNode: ReactNode | string): string {
  if (typeof inputNode === 'string') {
    return inputNode;
  } else if (React.isValidElement(inputNode)) {
    return drillReactNodeForText(inputNode.props.children);
  }
  return '';
}

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
  fieldProps: any & { label: string | ReactNode },
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

  return {
    type: 'error',
    id: `status-${field}`,
    message: `${drillReactNodeForText(
      fieldProps.label || fieldProps.legend
    )} is required for OEC reporting.`,
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
  const message = 'This information is required for OEC reporting.';

  return {
    type: 'error',
    id: `status-${fields.join('-')}`,
    message,
    ...options,
  };
}
