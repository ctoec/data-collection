import moment from 'moment';

// UPDATE THESE IF YOU CHANGE THIS FILE!!
// TODO: add pre-merge hook that updates these values (probably put them in a diff file)
// automatically when this file gets updated
export const TEMPLATE_VERSION = 1;
export const TEMPLATE_LAST_UPDATED = moment.utc('01-04-2021', ['MM-DD-YYYY']);

// Formats
export const BOOLEAN_FORMATS = ['Yes', 'Y', 'No', 'N', 'Not collected'];
// Note: The Moment parser ignores separator characters in format strings, so don't
// need multiple copies with '/' and '-'. Also, formats earlier in the array are
// given priority, so this ordering matters. See:
// https://momentjs.com/docs/#/parsing/string-format/ and
// https://momentjs.com/docs/#/parsing/string-formats/
export const DATE_FORMATS = [
  'MM/YY',
  'MMM/YY',
  'MM/YYYY',
  'MMM/YYYY',
  'MM/DD/YYYY',
  'MM/DD/YY',
  'YYYY/MM/DD',
];
export const REPORTING_PERIOD_FORMATS = [
  'MM/YY',
  'MMM/YY',
  'MM/YYYY',
  'MM/DD/YYYY',
];

// Conditional requirement strings
export const REQUIRED_IF_US_BORN =
  'Required if the "Birth Certificate Type" field is "US Birth Certificate."';
export const REQUIRED_AT_LEAST_ONE = 'At least one race option required';
export const REQUIRED_NOT_FOSTER =
  'Required if child is not living with foster family';
export const REQUIRED_IF_INCOME_DISCLOSED =
  'Required unless the "income not disclosed" field has a value of "Yes"';
export const REQUIRED_IF_CHANGED_ENROLLMENT =
  'Only required for children who:  \n- Withdrew  \n- Changed age group and/or site'; // double-spaces are required for front-end Markdown formatting
export const REQUIRED_IF_CHANGED_ENROLLMENT_FUNDING =
  REQUIRED_IF_CHANGED_ENROLLMENT + '  \n- Changed funding source';

// Collection requirement reasons
export const REPORTING_REASON = 'Used for reporting';
export const DEMOGRAPHIC_REPORTING_REASON = 'Used for demographic reporting';
export const GEOGRAPHIC_REPORTING_REASON = 'Used for geographic reporting';
export const UTILIZATION_REPORTING_REASON =
  'Used for reporting on the utilization of state funded spaces.';
