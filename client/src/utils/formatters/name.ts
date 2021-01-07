import { Child } from '../../shared/models';
import { capitalizeFirstLetter } from './sentenceCase';

const nameMissingText = 'name missing';
const missingFirstNameText = 'first name missing';
const missingLastNameText = 'last name missing';

const format = (text: string, capitalize?: boolean, addParens?: boolean) => {
  let returnVal = text;
  if (capitalize) returnVal = capitalizeFirstLetter(text);
  if (addParens) returnVal = `(${returnVal})`;
  return returnVal;
};

export const nameFormatter = (
  child?: Child,
  opts?: {
    lastNameFirst?: boolean;
    firstOnly?: boolean;
    capitalize?: boolean;
    // Capitalize first letter of missing name text
  }
) => {
  const { lastName, firstName } = child || {};
  const { lastNameFirst, firstOnly, capitalize: _capitalize } = opts || {};

  // If we should only return the first or last name
  if (firstOnly) {
    return firstName || format('this child', _capitalize);
  }

  if (!lastName && !firstName) {
    return format(nameMissingText, _capitalize, true);
  }

  let _lastName = lastName || missingLastNameText;
  let _firstName = firstName || missingFirstNameText;

  // Middle name and suffix should be omitted (until we have a use case for them)

  // If the last name should be first
  if (lastNameFirst) {
    return `${format(_lastName, _capitalize, !lastName)}, ${format(
      _firstName,
      false,
      !firstName
    )}`;
  }

  return `${format(_firstName, _capitalize, !firstName)} ${format(
    _lastName,
    false,
    !lastName
  )}`;
};
