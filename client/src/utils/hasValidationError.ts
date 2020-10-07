import { Child, ObjectWithValidationErrors } from '../shared/models';

export const hasValidationError = (record?: Child) => {
  return record && record.validationErrors && record.validationErrors.length;
};

export const hasValidationErrorForField = (
  entity: ObjectWithValidationErrors,
  field: string
) => {
  return (
    !!entity.validationErrors &&
    entity.validationErrors.some((err) => err.property === field)
  );
};
