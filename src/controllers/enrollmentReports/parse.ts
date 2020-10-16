import { readFile, utils, WorkSheet } from 'xlsx';
import pluralize from 'pluralize';
import { getConnection } from 'typeorm';
import moment from 'moment';
import {
  EnrollmentReportRow,
  SECTIONS,
  DATE_FORMATS,
  REPORTING_PERIOD_FORMATS,
} from '../../template';
import { BadRequestError } from '../../middleware/error/errors';
import { getAllColumnMetadata } from '../../template';

/**
 * Parses the uploaded file into:
 * 	- an array of column header strings from the uploaded template
 *  - an array of EnrollmentReportRows
 * Also checks that supplied headers match headers from template.
 * @param file
 */
export function parseUploadedTemplate(file: Express.Multer.File) {
  /** MODEL PROPERTY CONSTS **/

  const columnMeta = getAllColumnMetadata();

  const [objectProperties, expectedHeaders] = columnMeta
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

  const fileData = readFile(file.path);
  const sheet = Object.values(fileData.Sheets)[0];

  updateSheetRange(sheet);
  const { headers, data } = parseSheet(sheet, objectProperties);

  // Array comparison was returning false even when the strings matched
  if (
    !expectedHeaders.every((header, idx) => header === headers[idx]) ||
    expectedHeaders.length != headers.length
  ) {
    const headersSet = new Set(headers);
    const expectedHeadersSet = new Set(expectedHeaders);
    const missingHeaders = expectedHeaders.filter(
      (x) => !headersSet.has(x) && x
    );
    const excessHeaders = headers.filter(
      (x) => !expectedHeadersSet.has(x) && x
    );

    let errorMessage = '';
    if (missingHeaders.length > 0) {
      const [missingMessage, missingNumber] = getInvalidColumnData(
        missingHeaders,
        'missing'
      );
      if (excessHeaders.length > 0) {
        const [excessMessage, excessNumber] = getInvalidColumnData(
          excessHeaders,
          'extra'
        );
        errorMessage =
          'You have ' +
          missingNumber +
          ' and ' +
          excessNumber +
          '.\n' +
          missingMessage +
          ' ' +
          excessMessage;
      } else {
        errorMessage =
          'Your file has ' + missingNumber + '.\n' + missingMessage;
      }
    } else {
      const [excessMessage, excessNumber] = getInvalidColumnData(
        excessHeaders,
        'extra'
      );
      errorMessage = 'Your file has ' + excessNumber + '.\n' + excessMessage;
    }
    throw new BadRequestError(errorMessage);
  }

  if (!data.length) {
    throw new BadRequestError(
      'You uploaded an empty file\nCheck to make sure your file has child data in it.'
    );
  }

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

  return data.map((rawRow) =>
    parseEnrollmentReportRow(rawRow, booleanProperties, dateProperties)
  );
}

/**
 * Copied from https://github.com/SheetJS/sheetjs/issues/764#issuecomment-320517667
 *
 * Forces sheet range resize to avoid excessive resource utilization when parsing sheet.
 * This can occur if excel metadata gets corrupted when the worksheet is edited and
 * it incorrectly reports a much larger size than it actually is.
 * @param sheet
 */
function updateSheetRange(sheet: WorkSheet) {
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
function getSheetType(sheet: WorkSheet): 'xlxs' | 'csv' {
  return sheet['B1'].v === SECTIONS.CHILD_INFO ? 'xlxs' : 'csv';
}

/**
 * Converts a raw object parsed from the uploaded file into
 * an EnrollmentReportRow, with parsed boolean values and
 * date values (as Moment instances).
 * @param rawEnrollment
 */
function parseEnrollmentReportRow(
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
      if (typeof value === 'string') {
        const m = moment.utc(value, [
          ...DATE_FORMATS,
          ...REPORTING_PERIOD_FORMATS,
        ]);
        rawEnrollment[prop] = m.isValid() ? m : undefined;
      } else if (typeof value === 'number') {
        rawEnrollment[prop] = excelDateToDate(value);
      }
    }

    // Parse zip codes
    if (prop.match(/zipCode/i)) {
      const zipString = value.toString();
      if (zipString.length === 4) {
        rawEnrollment[prop] = `0${zipString}`;
      }

      if (zipString.length > 5) {
        rawEnrollment[prop] = zipString.slice(0, 5);
      }
    }
  });

  return rawEnrollment as EnrollmentReportRow;
}

/**
 * Convert proprietary excel date serial number to Moment,
 * inspired by https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
 */
function excelDateToDate(excelDate: number) {
  const SERIAL_UNIX_DAY_DIFF = 25569;
  const DAY_TO_SECONDS = 60 * 60 * 24;

  var timestamp = Math.floor(excelDate - SERIAL_UNIX_DAY_DIFF) * DAY_TO_SECONDS;
  const m = moment.unix(timestamp);
  return m.isValid() ? m : undefined;
}

/**
 * Gets boolean value for a raw string boolean.
 *
 * Empty or missing string, 'N', and 'No' (case-insensitive) return false.
 * Other values return true.
 * @param value
 */
function getBoolean(value: string): boolean {
  if (['Y', 'YES'].includes(value?.trim().toUpperCase())) return true;
  else if (['N', 'NO'].includes(value?.toUpperCase())) return false;
  return null;
}

/**
 * Converts an array of column names and returns a comma separated string ended with and if appropriate
 * @param invalidColumns - Array of columns that are invalid
 * @param invalidReason - Single word describing why columns are invalid
 */
function getInvalidColumnData(
  invalidColumns: string[],
  invalidReason: string
): [string, string] {
  if (invalidColumns.length == 1) {
    const invalidString = invalidColumns[0] + ' is ' + invalidReason + '.';
    const invalidNumber = '1 ' + invalidReason + ' column';
    return [invalidString, invalidNumber];
  } else {
    const invalidString =
      invalidColumns.slice(0, -1).join(', ') +
      ' and ' +
      invalidColumns.slice(-1) +
      ' are ' +
      invalidReason +
      '.';
    const invalidNumber =
      invalidColumns.length + ' ' + invalidReason + ' columns';
    return [invalidString, invalidNumber];
  }
}
