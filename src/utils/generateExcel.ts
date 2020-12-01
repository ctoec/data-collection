import { WorkBook, utils, ColInfo, WorkSheet } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { wrapText } from '../utils/string';
import { getAllColumnMetadata } from '../template';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../client/src/shared/constants';

export function generateExcelWorkbook(rows?: string[][]): WorkBook {
  const columnMetadatas: ColumnMetadata[] = getAllColumnMetadata();

  let columnNames: string[] = [];
  let formats: string[] = [];
  let sections: string[] = [];
  let sectionCounts: any = {};
  let cols: ColInfo[] = [];

  columnMetadatas.forEach((columnMetadata, index) => {
    sections[index] = columnMetadata.section;
    columnNames[index] =
      columnMetadata.requirementLevel !== TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL
        ? columnMetadata.formattedName
        : `(OPTIONAL) ${columnMetadata.formattedName}`;
    formats[index] = columnMetadata.format;

    //  Reserve a certain number of minimum characters for column widths, for the sake of
    //  having actually readable format descriptors
    const displayNameLength: number = columnMetadata.formattedName.length;
    const columnCharCount: number =
      displayNameLength > 16 ? displayNameLength : 16;

    cols[index] = {
      wch: columnCharCount,
    };

    formats[index] = wrapText(columnMetadata.format, columnCharCount);

    if (!sectionCounts[columnMetadata.section]) {
      sectionCounts[columnMetadata.section] = 0;
    } else {
      sectionCounts[columnMetadata.section]++;
    }
  });

  const twoDimensionalArray = [sections, columnNames, formats];

  const sheet: WorkSheet = utils.aoa_to_sheet(twoDimensionalArray);
  if (rows) {
    utils.sheet_add_aoa(sheet, rows, { origin: -1 });
  }

  let merges = [];
  let start = 0;

  //  Iterate through each column's section and add merge points whenever
  //  the section changes
  sections.forEach((sectionName, index) => {
    if (index === sections.length - 1 || sectionName !== sections[index + 1]) {
      merges.push({ s: { c: start, r: 0 }, e: { c: index, r: 0 } });
      start = index + 1;
    }
  });

  sheet['!cols'] = cols;
  sheet['!merges'] = merges;

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
}
