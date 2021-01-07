import { Child } from '../../shared/models';
import { capitalizeFirstLetter } from './sentenceCase';

const nameMissingText = 'name missing';
const missingFirstNameText = 'first name missing'
const missingLastNameText = 'last name missing'

export const nameFormatter = (
  child?: Child,
  opts?: {
    lastNameFirst?: boolean;
    firstOnly?: boolean;
    capitalize?: boolean
    // Capitalize first letter of missing name text
  }
) => {
  const { lastName, firstName } = child || {};
  const {
    lastNameFirst,
    firstOnly,
    capitalize
  } = opts || {};

  const capFunc = capitalize ? capitalizeFirstLetter : (text: string) => text

  // If we should only return the first or last name
  if (firstOnly) {
    return firstName || capFunc('this child');
  }

  if (!lastName && !firstName) {
    return `(${capFunc(nameMissingText)})`;
  }

  let _lastName = lastName || missingLastNameText;
  let _firstName = firstName || `(${capFunc(missingFirstNameText)})`;


  // Middle name and suffix should be omitted (until we have a use case for them)

  // If the last name should be first
  if (lastNameFirst) {
    return `${_lastName}, ${_firstName}`;
  }

  return `${_firstName} ${_lastName}`;
};
