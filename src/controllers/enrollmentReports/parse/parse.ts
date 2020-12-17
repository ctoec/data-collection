import { readFile } from 'xlsx';
import { BadRequestError } from '../../../middleware/error/errors';
import {
  updateSheetRange,
  getPropertyNamesAndExpectedHeaders,
  parseSheet,
  getInvalidHeadersError,
  getSpecialProperties,
  parseEnrollmentReportRow,
} from './parseUtils';

/**
 * Parses the uploaded file into:
 * 	- an array of column header strings from the uploaded template
 *  - an array of EnrollmentReportRows
 * Also checks that supplied headers match headers from template.
 * @param file
 */
export function parseUploadedTemplate(file: Express.Multer.File) {
  const fileData = readFile(file.path);
  const sheet = Object.values(fileData.Sheets)[0];

  updateSheetRange(sheet);

  const {
    propertyNames,
    expectedHeaders,
  } = getPropertyNamesAndExpectedHeaders();
  const { headers, data } = parseSheet(sheet, propertyNames);

  const excessInvalidHeadersError = getInvalidHeadersError(
    headers,
    expectedHeaders
  );
  if (excessInvalidHeadersError) {
    throw new BadRequestError(excessInvalidHeadersError);
  }

  if (!data.length) {
    throw new BadRequestError(
      'You uploaded an empty file\nCheck to make sure your file has enrollment data in it.'
    );
  }

  const { booleanProperties, dateProperties } = getSpecialProperties();
  return data.map((rawRow) =>
    parseEnrollmentReportRow(rawRow, booleanProperties, dateProperties)
  );
}
