import { readFile, utils, WorkSheet } from 'xlsx';
import { getConnection, getManager } from 'typeorm';
import { FlattenedEnrollment } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import moment from 'moment';

/**
 * Parses the uploaded file into:
 * 	- an array of column header strings from the uploaded template
 *  - an array of FlattenedEnrollments
 * Also returns an array containing the expected template headers, in order,
 * to enable checking that uploaded headers are correct (generated here to reduce
 * code duplication, since we're already pulling the FlattenedEnrollment meta).
 * @param file
 */
export function parseUploadedTemplate(file: Express.Multer.File) {
  /** MODEL PROPERTY CONSTS **/
  const FLATTENED_ENROLLMENT_COLUMNS = getConnection().getMetadata(
    FlattenedEnrollment
  ).columns;

  const [OBJECT_PROPERTIES, EXPECTED_HEADERS] = FLATTENED_ENROLLMENT_COLUMNS
    // get DataDefinition metadata
    .map((column) =>
      getColumnMetadata(new FlattenedEnrollment(), column.propertyName)
    )
    // remove any columns without data definitions, as these are not present in the template
    .filter((dataDefinition) => !!dataDefinition)
    // create two arrays:
    // - OBJECT_PROPERTIES contains the property names for FlattenedEnrollments parsed from template data
    // - EXPECTED_HEADERS contains the formatted names used in the template as headers
    .reduce(
      (acc, cur) => [
        [...acc[0], cur.propertyName],
        [...acc[1], cur.formattedName],
      ],
      [[], []]
    );

  const BOOLEAN_PROPERTIES = FLATTENED_ENROLLMENT_COLUMNS.filter((column) =>
    column.type.toString().includes('Boolean')
  ).map((column) => column.propertyName);

  const fileData = readFile(file.path, {
    cellDates: true,
  });
  const sheet = Object.values(fileData.Sheets)[0];

  update_sheet_range(sheet);
  const { headers, data } = parseSheet(sheet, OBJECT_PROPERTIES);

  return {
    EXPECTED_HEADERS,
    headers,
    enrollments: data.map((rawEnrollment) =>
      parseFlattenedEnrollment(rawEnrollment, BOOLEAN_PROPERTIES)
    ),
  };
}

/**
 * Copied from https://github.com/SheetJS/sheetjs/issues/764#issuecomment-320517667
 *
 * Forces sheet range resize to avoid excessive resource utilization when parsing sheet.
 * This can occur if excel metadata gets corrupted when the worksheet is edited and
 * it incorrectly reports a much larger size than it actually is.
 * @param sheet
 */
function update_sheet_range(sheet: WorkSheet) {
  var range = { s: { r: Infinity, c: Infinity }, e: { r: 0, c: 0 } };
  Object.keys(sheet)
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
  sheet['!ref'] = utils.encode_range(range);
}

/**
 * Parses the uploaded template data sheet into:
 * - an array of column header strings from the uploaded template
 * - an array of objects with properties defined by objectProperties,
 * and values from the template data.
 *
 * @param sheet
 * @param objectProperties
 */
function parseSheet(sheet: WorkSheet, objectProperties: string[]) {
  const parsedSheet = utils.sheet_to_json<FlattenedEnrollment>(sheet, {
    header: objectProperties,
  });

  const sheetType = getSheetType(sheet);
  // If excel, column headers are second row after section headers,
  // otherwise column heaers are first row.
  const headers = Object.values(parsedSheet[sheetType === 'xlxs' ? 1 : 0]);
  // If excel, data starts on 4th row, after section and column headers
  // and data definitions, otherwise data starts on  row.
  const data = parsedSheet.slice(sheetType === 'xlxs' ? 3 : 1);

  return { headers, data };
}

/**
 * Gets the type of template uploaded by the user.
 * If the value of cell B1 is 'Child Info', that means the
 * template has section headers, and is excel template.
 * @param sheet
 */
function getSheetType(sheet: WorkSheet): 'xlxs' | 'csv' {
  return sheet['B1'].v === 'Child Info' ? 'xlxs' : 'csv';
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

    if (value instanceof Date) {
      rawEnrollment[prop] = moment.utc(value);
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
