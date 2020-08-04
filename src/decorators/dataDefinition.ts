import 'reflect-metadata';

// Formats
export const BOOLEAN_FORMAT = 'Yes, Y, No, N';
export const DATE_FORMAT = 'MM/DD/YYYY, YYYY-MM-DD, MM-DD-YYYY';
export const REPORTING_PERIOD_FORMAT = 'MM/YYYY';

// Requirements
export const REQUIRED = 'Required';
export const REQUIRED_IF_US_BORN = 'Required if child was born in the U.S.';
export const REQUIRED_AT_LEAST_ONE = 'At least one required';
export const REQUIRED_NOT_FOSTER =
  'Required if child is not living with foster family';
export const OPTIONAL = 'Optional';

// Reasons
export const REPORTING_REASON = 'Used for reporting.';
export const DEMOGRAPHIC_REPORTING_REASON = 'Used for demographic reporting.';
export const GEOGRAPHIC_REPORTING_REASON = 'Used for geographic reporting.';
export const UTILIZATION_REPORTING_REASON =
  'Used for reporting on the utilization of state funded spaced';

const DATA_DEFINITION_KEY = Symbol('definitionMetadata');

export type DataDefinitionInfo = {
  formattedName: string;
  required: string;
  definition: string;
  reason: string;
  format: string;
  example: string;
};

export const DataDefinition = (definition: DataDefinitionInfo) =>
  Reflect.metadata(DATA_DEFINITION_KEY, definition);

export const getDataDefinition = (target: any, propertyKey: string) =>
  Reflect.getMetadata(
    DATA_DEFINITION_KEY,
    target,
    propertyKey
  ) as DataDefinitionInfo;
