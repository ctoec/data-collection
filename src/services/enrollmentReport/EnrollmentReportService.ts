import { EnrollmentReport, FlattenedEnrollment } from '../../entity';
import { readFile, utils, WorkSheet } from 'xlsx';
import { getManager, getConnection } from 'typeorm';

export class EnrollmentReportService {
  public async get(id: number): Promise<EnrollmentReport> {
    return getManager().findOne(EnrollmentReport, id);
  }

  public async save(
    enrollmentReport: EnrollmentReport
  ): Promise<EnrollmentReport> {
    return getManager().save(enrollmentReport);
  }

  /**
   * Parses an uploaded file into an array of
   * FlattenedEnrollments.
   * @param enrollmentReportBodyParams
   */
  public parse(
    enrollmentReportBodyParams: Express.Multer.File
  ): FlattenedEnrollment[] {
    const fileData = readFile(enrollmentReportBodyParams.path, {
      cellDates: true,
    });

    const sheet = Object.values(fileData.Sheets)[0];

    const flattenedEnrollmentColumns = getConnection().getMetadata(
      FlattenedEnrollment
    ).columns;
    // Properties are all entity properties except:
    // - internal id
    // - parent report object & id
    const objectProperties = flattenedEnrollmentColumns
      .filter(
        (column) =>
          column.propertyName !== 'id' &&
          column.propertyName !== 'report' &&
          column.propertyName !== 'reportId'
      )
      .map((column) => column.propertyName);

    // Parse sheet to anonymous object with properties from FlattenedEnrollment
    const parsedSheet = utils.sheet_to_json(sheet, {
      range: this.getStartingRow(sheet),
      header: objectProperties,
    });

    // Get all entity properties that are booleans.
    // For some reason, column.type is of type 'function',
    // and boolean columns are function named 'Boolean'
    const booleanFields = flattenedEnrollmentColumns
      .filter((column) => column.type.toString().includes('Boolean'))
      .map((column) => column.propertyName);

    // Parse anonymous objects into FlattenedEnrollment entities
    return parsedSheet.map((enrollment) =>
      this.parseFlattenedEnrollment(enrollment as object, booleanFields)
    );
  }

  /**
   * Gets the row at which data starts, depending on
   * upload format type. If using the excel template,
   * data starts on row 3 after section headers, column headers,
   * and column descriptions. If using the csv template,
   * data starts on row 1 after column headers.
   * @param sheet
   */
  private getStartingRow(sheet: WorkSheet): number {
    // If the second cell in the first row has value 'Child Info'
    // then the sheet has section headers, meaning it is the
    // excel format.
    return sheet['B1'].v === 'Child Info' ? 3 : 1;
  }

  /**
   * Convert raw enrollment object from parsed template into
   * FlattenedEnrollment object, created by the ORM entity manager
   *
   * Parses string boolean values into true booleans
   * @param rawEnrollment
   */
  private parseFlattenedEnrollment(
    rawEnrollment: object,
    booleanFields: string[]
  ) {
    Object.entries(rawEnrollment).forEach(([property, value]) => {
      if (booleanFields.includes(property)) {
        rawEnrollment[property] = this.getBoolean(value);
      }
    });

    return getConnection().manager.create(FlattenedEnrollment, rawEnrollment);
  }

  /**
   * Gets the boolean value for a raw string boolean.
   *
   * Empty or missing string, 'N', and 'No' return false.
   * Other values return true.
   * @param value
   */
  private getBoolean(value: string): boolean {
    if (['', 'N', 'NO', undefined].includes(value?.toUpperCase())) return false;
    return true;
  }
}
