import { ColumnMetadata } from '../../../client/src/shared/models';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../../client/src/shared/constants';

/**
 * Prepends (OPTIONAL) to optional column headers and capitalizes first letter
 * @param columnMetadata
 */
export const getFormattedColumnHeader = (columnMetadata: ColumnMetadata) =>
  columnMetadata.requirementLevel !== TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL
    ? sentenceCase(columnMetadata.formattedName)
    : `(OPTIONAL) ${sentenceCase(columnMetadata.formattedName)}`;

export function sentenceCase(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
