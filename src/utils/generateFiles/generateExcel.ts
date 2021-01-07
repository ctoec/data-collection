import { WorkBook, utils, ColInfo, WorkSheet } from 'xlsx';
import { ColumnMetadata } from '../../../client/src/shared/models';
import { wrapText } from '../wrapText';
import { getAllColumnMetadata } from '../../template';
import { getFormattedColumnHeader } from './getFormattedColumnHeader';

export function generateExcelWorkbook(rows?: string[][]): WorkBook {
  const columnMetadatas: ColumnMetadata[] = getAllColumnMetadata();

  let columnNames: string[] = [];
  let formats: string[] = [];
  let sections: string[] = [];
  let sectionCounts: any = {};
  let cols: ColInfo[] = [];

  columnMetadatas.forEach((columnMetadata, index) => {
    sections[index] = columnMetadata.section;
    columnNames[index] = getFormattedColumnHeader(columnMetadata);

    // Reserve a certain number of minimum characters for column widths, for the sake of
    // having actually readable format descriptors
    const displayNameLength: number = columnMetadata.formattedName.length;
    const columnCharCount: number =
      displayNameLength > 16 ? displayNameLength : 16;

    cols[index] = {
      wch: columnCharCount,
    };

    formats[index] = wrapText(
      getFormattedColumnFormat(columnMetadata),
      columnCharCount
    );
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

  // Iterate through each column's section and add merge points whenever
  // the section changes
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

/**
 * Quick fix for replacing relative markdown-style links with real URLs.
 * Always replace template link with prod link for now, to avoid needing
 * to inject and access FQDN in the app
 * @param columnMetadata
 */
function getFormattedColumnFormat(columnMetadata: ColumnMetadata) {
  const match = columnMetadata.format.match(/(\[.*\]\((\/.*)\))/);
  const productionSitePath = 'https://ece-reporter.ctoec.org';
  if (match && match.length >= 3) {
    return columnMetadata.format.replace(
      match[1],
      `${productionSitePath}${match[2]}`
    );
  }
  return columnMetadata.format;
}
