import { getAllColumnMetadata } from '../template';
import { ColumnMetadata } from '../../client/src/shared/models';
import { utils } from 'xlsx';

/**
 * Process an array of retrieved child objects and turn them into
 * string representations to cascade into a CSV with column headers.
 * @param childArray
 */
export function generateCSV(rows?: string[][]) {
  const columnMetadatas: ColumnMetadata[] = getAllColumnMetadata();
  const formattedColumnNames: string[] = columnMetadatas.map(
    (c) => c.formattedName
  );
  const sheet = utils.aoa_to_sheet([formattedColumnNames]);

  if (rows) {
    utils.sheet_add_aoa(sheet, rows, { origin: -1 });
  }
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);
  return workbook;
}
