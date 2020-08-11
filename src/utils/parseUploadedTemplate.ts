import { readFile, utils, WorkSheet } from 'xlsx';
import { getConnection, getManager } from 'typeorm';
import { FlattenedEnrollment } from '../entity';

/**
 * Parses the uploaded file into an array of FlattenedEnrollments
 * @param file
 */
export function parseUploadedTemplate(file: Express.Multer.File) {
  /** MODEL PROPERTY CONSTS **/
  const FLATTENED_ENROLLMENT_COLUMNS = getConnection().getMetadata(
    FlattenedEnrollment
  ).columns;

  const SHEET_HEADERS = FLATTENED_ENROLLMENT_COLUMNS.map(
    (column) => column.propertyName
  ).filter((header) => !['id', 'report', 'reportId'].includes(header));

  const BOOLEAN_PROPERTIES = FLATTENED_ENROLLMENT_COLUMNS.filter((column) =>
    column.type.toString().includes('Boolean')
  ).map((column) => column.propertyName);

  const fileData = readFile(file.path, {
    cellDates: true,
  });
  const sheet = Object.values(fileData.Sheets)[0];

  if (!sheet) throw new Error('Invalid data uploaded');

  update_sheet_range(sheet);
  const parsedSheet = utils.sheet_to_json<FlattenedEnrollment>(sheet, {
    range: getStartingRow(sheet),
    header: SHEET_HEADERS,
  });

  return parsedSheet.map((row) =>
    parseFlattenedEnrollment(row, BOOLEAN_PROPERTIES)
  );
}

/**
 * Copied from https://github.com/SheetJS/sheetjs/issues/764#issuecomment-320517667
 *
 * Forces sheet range resize to avoid excessive resource utilization when parsing sheet.
 * This can occur if excel metadata gets corrupted when the worksheet is edited and
 * it incorrectly reports a much larger size than it actually is.
 * @param ws
 */
function update_sheet_range(ws) {
  var range = { s: { r: Infinity, c: Infinity }, e: { r: 0, c: 0 } };
  Object.keys(ws)
    .filter(function (x) {
      return x.charAt(0) != '!';
    })
    .map(utils.decode_cell)
    .forEach(function (x) {
      range.s.c = Math.min(range.s.c, x.c);
      range.s.r = Math.min(range.s.r, x.r);
      range.e.c = Math.max(range.e.c, x.c);
      range.e.r = Math.max(range.e.r, x.r);
    });
  ws['!ref'] = utils.encode_range(range);
}

/**
 * Gets the row at which data starts for each template type.
 * In excel template, there are 3 rows of header data (section
 * headers, column headers, and column descriptions). In the
 * csv template there is one row of header data (column headers).
 * @param sheet
 */
function getStartingRow(sheet: WorkSheet): number {
  return sheet['B1'].v === 'Child Info' ? 3 : 1;
}

/**
 * Converts a raw object parsed from the uploaded file into
 * a FlattenedEnrollment, with parsed boolean values.
 * @param rawEnrollment
 */
function parseFlattenedEnrollment(
  rawEnrollment: object,
  booleanProperties: string[]
) {
  Object.entries(rawEnrollment).forEach(([prop, value]) => {
    if (booleanProperties.includes(prop)) {
      rawEnrollment[prop] = getBoolean(value);
    }
  });

  return getManager().create(FlattenedEnrollment, rawEnrollment);
}

/**
 * Gets boolean value for a raw string boolean.
 *
 * Empty or missing string, 'N', and 'No' (case-insensitive) return false.
 * Other values return true.
 * @param value
 */
function getBoolean(value: string): boolean {
  if (['', 'N', 'NO', undefined].includes(value?.toUpperCase())) return false;
  return true;
}
