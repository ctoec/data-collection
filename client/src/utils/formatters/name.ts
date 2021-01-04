import { Child } from '../../shared/models';

export const firstNameMissingText = '(name missing)';

export const nameFormatter = (
  child?: Child,
  opts?: {
    lastNameFirst?: boolean;
    firstOnly?: boolean;
    lastOnly?: boolean;
    missingFirstNameText?: string;
    missingLastNameText?: string;
    missingFirstAndLastText?: string;
  }
) => {
  const { lastName, firstName, middleName, suffix } = child || {};
  const {
    lastNameFirst,
    firstOnly,
    lastOnly,
    missingFirstAndLastText,
    missingFirstNameText,
    missingLastNameText,
  } = opts || {};

  if (!lastName && !firstName) {
    return missingFirstAndLastText || 'child';
  }

  let _lastName = lastName || missingLastNameText || '';
  let _firstName = firstName || missingFirstNameText || '';

  // If we should only return the first or last name
  if (firstOnly) {
    return _firstName || 'child';
  }
  if (lastOnly) {
    return _lastName || 'child';
  }

  // If the last name should be first
  if (lastNameFirst) {
    return `${_lastName}, ${_firstName}${suffix ? `, ${suffix}` : ''}`;
  }

  return `${_firstName}${middleName ? ` ${middleName}` : ''} ${_lastName}${
    suffix ? `, ${suffix}` : ''
  }`;
};
