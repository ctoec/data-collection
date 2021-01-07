import 'reflect-metadata';
import { ColumnMetadata as ColumnMetadataInterface } from '../../../client/src/shared/models';

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
