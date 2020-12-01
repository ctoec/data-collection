import { ColumnMetadata } from '../../../client/src/shared/models';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../../client/src/shared/constants';

/**
 * Prepends (OPTIONAL) to optional column headers
 * @param columnMetadata
 */
export const getFormattedColumnHeader = (columnMetadata: ColumnMetadata) =>
  columnMetadata.requirementLevel !== TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL
    ? columnMetadata.formattedName
    : `(OPTIONAL) ${columnMetadata.formattedName}`;
