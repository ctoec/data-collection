import moment, { Moment } from 'moment';
import { WorkSheet, utils } from 'xlsx';
import {
  getAllColumnMetadata,
  EnrollmentReportRow,
  DATE_FORMATS,
  REPORTING_PERIOD_FORMATS,
} from '../../../template';
import { TEMPLATE_SECTIONS } from '../../../../client/src/shared/constants';

/************************ HELPER FUNCTIONS *****************************/
/**
 * From template metadata, pull out the property names for a flattened enrollment
 * object and the formatted field names, used as template headers.
 *
 * Returned as on object containing `propertyNames` and `expectedHeaders`, which
 * are both string arrays.
 */
export function getPropertyNamesAndExpectedHeaders() {
  const [properties, headers] = getAllColumnMetadata()
    // remove any columns without data definitions, as these are not present in the template
    .filter((dataDefinition) => !!dataDefinition)
    // create two arrays:
    // - OBJECT_PROPERTIES contains the property names for FlattenedEnrollments parsed from template data
    // - EXPECTED_HEADERS contains the formatted names used in the template as headers
    .reduce(
      (_propsAndHeaders, _metadata) => [
        [..._propsAndHeaders[0], _metadata.propertyName],
        [..._propsAndHeaders[1], _metadata.formattedName],
      ],
      [[], []]
    );

  return { propertyNames: properties, expectedHeaders: headers };
}

/**
 * Copied from https://github.com/SheetJS/sheetjs/issues/764#issuecomment-320517667
 *
 * Forces sheet range resize to avoid excessive resource utilization when parsing sheet.
 * This can occur if excel metadata gets corrupted when the worksheet is edited and
 * it incorrectly reports a much larger size than it actually is.
 * @param sheet
 */
export function updateSheetRange(sheet: WorkSheet) {
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

export function parseSheet(sheet: WorkSheet, objectProperties: string[]) {
  const parsedSheet = utils.sheet_to_json<EnrollmentReportRow>(sheet, {
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

/*
 * Gets the type of template uploaded by the user.
 * If the value of cell B1 is 'Child Info', that means the
 * template has section headers, and is excel template.
 * @param sheet
 */
export function getSheetType(sheet: WorkSheet): 'xlxs' | 'csv' {
  return sheet['B1']?.v === TEMPLATE_SECTIONS.CHILD_IDENT ? 'xlxs' : 'csv';
}

/**
 * Returns an object with lists of all property names for given
 * 'special' property types (which required special handling in
 * row parsing). Currently, returns a list of boolean properties
 * and date properties.
 */
export function getSpecialProperties() {
  const booleanProperties: string[] = [];
  const dateProperties: string[] = [];
  Object.entries(new EnrollmentReportRow()).forEach(([prop, value]) => {
    if (typeof value === 'boolean') {
      booleanProperties.push(prop);
    }
    if (moment.isMoment(value)) {
      dateProperties.push(prop);
    }
  });

  return { booleanProperties, dateProperties };
}

/**
 * Converts a raw object parsed from the uploaded file into
 * an EnrollmentReportRow, with parsed boolean values and
 * date values (as Moment instances).
 * @param rawEnrollment
 */
export function parseEnrollmentReportRow(
  rawEnrollment: object,
  booleanProperties: string[],
  dateProperties: string[]
) {
  Object.entries(rawEnrollment).forEach(([prop, value]) => {
    // Parse booleans
    if (booleanProperties.includes(prop)) {
      rawEnrollment[prop] = getBoolean(value);
    }

    // Parse dates
    if (dateProperties.includes(prop)) {
      rawEnrollment[prop] = getDate(value, prop);
    }

    // Parse zipcodes
    if (prop.match(/zipcode/i)) {
      rawEnrollment[prop] = getZipCode(value);
    }
  });

  return rawEnrollment as EnrollmentReportRow;
}

/**
 * Gets boolean value from a raw string value.
 *
 * Empty or missing string, 'N', and 'No' (case-insensitive) return false.
 * Other values return true.
 * @param value
 */
export function getBoolean(value: string | number | boolean): boolean {
  if (typeof value === 'boolean' || typeof value === 'number') return !!value;
  if (['Y', 'YES'].includes(value?.trim().toUpperCase())) return true;
  else if (['N', 'NO'].includes(value?.toUpperCase())) return false;
  return null;
}

/**
 * Gets Moment date value from a raw string or number value.
 *
 * Dates that have been parsed by excel as strings are converted
 * to moments using all of the date formats (for full date values)
 * and reporting period formats (for month/year values).
 *
 * Dates that have been parsed by excel as numbers are converted
 * to moments using a helper function to convert excel serial
 * date number to Moment date (excelDateToDate)
 */
export function getDate(value: string | number, prop: string): Moment {
  let parsedDate: Moment;
  if (typeof value === 'string') {
    const m = moment.utc(value, [...DATE_FORMATS, ...REPORTING_PERIOD_FORMATS]);
    parsedDate = m.isValid() ? m : undefined;
  }
  if (typeof value === 'number') {
    parsedDate = excelDateToDate(value);
  }
  return parsedDate;
}

/**
 * Convert proprietary excel date serial number to Moment,
 * inspired by https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
 */
export function excelDateToDate(excelDate: number) {
  const SERIAL_UNIX_DAY_DIFF = 25569;
  const DAY_TO_SECONDS = 60 * 60 * 24;

  var timestamp = Math.floor(excelDate - SERIAL_UNIX_DAY_DIFF) * DAY_TO_SECONDS;
  const m = moment.unix(timestamp);
  return m.isValid() ? m : undefined;
}

/**
 * Gets zipcode from raw string value.
 *
 * In Connecticut, many zipcodes start with 0. Excel truncates leading zeros,
 * so this adds a leading zero to any 4-digit zipcodes (which are invalid
 * and assumed truncated by excel). If zipcodes include more than 5-digits,
 * they are truncated to return just the first 5 digits.
 * @param value
 */
export function getZipCode(value: any) {
  const stringValue = value.toString();
  if (stringValue.length === 4) {
    return `0${stringValue}`;
  }

  if (stringValue.length > 5) {
    return stringValue.slice(0, 5);
  }

  // Base case for a zip code that's already 5 numbers with no leading 0
  return stringValue;
}

/**
 * Converts an array of column names and returns a comma separated string ended with and if appropriate
 * @param invalidColumns - Array of columns that are invalid
 * @param invalidReason - Single word describing why columns are invalid
 */
const invalidMessage = 'missing or incorrectly formatted';
export function getInvalidColumnData(
  invalidColumns: string[]
): [string, string] {
  if (invalidColumns.length == 1) {
    const invalidString = `"${invalidColumns[0]}" is ${invalidMessage}.`;
    const invalidNumber = `1 ${invalidMessage} column`;
    return [invalidString, invalidNumber];
  } else {
    const columnNames = `"${invalidColumns
      .slice(0, -1)
      .join('", "')}" and "${invalidColumns.slice(-1)}"`;
    const invalidString = `${columnNames} are ${invalidMessage}.`;
    const invalidNumber = `${invalidColumns.length} ${invalidMessage} columns`;
    return [invalidString, invalidNumber];
  }
}
/**
 * Returns a string for an error message with the excess or invalid columns that are in the uploaded spreadsheet
 * @param headers
 * @param expectedHeaders
 */
export function getInvalidHeadersError(
  headers: (string | undefined)[],
  expectedHeaders: string[]
): string {
  const missingHeaders = expectedHeaders.filter(
    (expectedHeader, idx) =>
      !headers[idx] ||
      !headers[idx].toLowerCase().includes(expectedHeader.toLowerCase())
  );
  const [missingMessage, missingNumber] = getInvalidColumnData(missingHeaders);

  if (missingHeaders.length > 0) {
    return `Your upload has ${missingNumber}.\n ${missingMessage} Download the latest template for the correct column headers and formatting.`;
  }
}
