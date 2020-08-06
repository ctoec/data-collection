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

  /**
   * Gets the row at which data starts for each template type.
   * In excel template, there are 3 rows of header data (section
   * headers, column headers, and column descriptions). In the
   * csv template there is one row of header data (column headers).
   * @param sheet
   */
  function getStartingRow(sheet: WorkSheet): number {
    return sheet['B1'] === 'Child Info' ? 3 : 1;
  }

  /**
   * Converts a raw object parsed from the uploaded file into
   * a FlattenedEnrollment, with parsed boolean values.
   * @param rawEnrollment
   */
  function parseFlattenedEnrollment(rawEnrollment: object) {
    Object.entries(rawEnrollment).forEach(([prop, value]) => {
      if (BOOLEAN_PROPERTIES.includes(prop)) {
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

  // Main
  const fileData = readFile(file.path, {
    cellDates: true,
  });
  const sheet = Object.values(fileData.Sheets)[0];

  if (sheet) {
    const parsedSheet = utils.sheet_to_json(sheet, {
      range: getStartingRow(sheet),
      header: SHEET_HEADERS,
    });

    return parsedSheet.map(parseFlattenedEnrollment);
  }
}
