import 'reflect-metadata';
import { ColumnMetadata as ColumnMetadataInterface } from '../../../client/src/shared/models';

// Formats
export const BOOLEAN_FORMAT = 'Yes, Y, No, N';
export const DATE_FORMATS = [
  'MM/DD/YYYY',
  'MM-DD-YYYY',
  'MM/DD/YY',
  'MM-DD-YY',
  'YYYY-MM-DD',
];
export const DATE_FORMAT = DATE_FORMATS.join(', ');
export const REPORTING_PERIOD_FORMATS = [
  'MM/YYYY',
  'MM-YYYY',
  'MM-YY',
  'MM/YY',
];
export const REPORTING_PERIOD_FORMAT = REPORTING_PERIOD_FORMATS.join(', ');

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
  'Used for reporting on the utilization of state funded spaces.';

const DATA_DEFINITION_KEY = Symbol('definitionMetadata');

/**
 * This type exists to allow the user to set the DataDefinition metadata
 * without providing the `propertyName` value, as this should come from the
 * property itself. It is added to the metadata object returned by
 * `getDataDefinition` (see below)
 */
type ColumnMetadataInput = Omit<ColumnMetadataInterface, 'propertyName'>;

/**
 * Set the provided data definition object as metadata for the given property
 * @param definition
 */
export const ColumnMetadata = (definition: ColumnMetadataInput) =>
  Reflect.metadata(DATA_DEFINITION_KEY, definition);

/**
 * Fetch the data definition metadata for the given property. If it exists,
 * return it augmented with propertyName property. Otherwise, return undefined.
 * @param target
 * @param propertyKey
 */
export const getColumnMetadata = (
  target: any,
  propertyName: string
): ColumnMetadataInterface => {
  const dataDef = Reflect.getMetadata(
    DATA_DEFINITION_KEY,
    target,
    propertyName
  );

  return !dataDef
    ? dataDef
    : ({
        ...dataDef,
        propertyName,
      } as ColumnMetadataInterface);
};