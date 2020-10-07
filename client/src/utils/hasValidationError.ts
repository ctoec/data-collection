import { Child } from '../shared/models';

export const hasValidationError = (record?: Child) => {
  return record && record.validationErrors && record.validationErrors.length;
};
