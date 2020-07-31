import { EnrollmentReport, FlattenedEnrollment } from '../../entity';
import { readFile, utils, WorkSheet } from 'xlsx';
import { getManager, getConnection } from 'typeorm';

export class EnrollmentReportService {
  public async get(id: number): Promise<EnrollmentReport> {
    return getManager().findOne(EnrollmentReport, id);
  }

  public async save(enrollmentReport: EnrollmentReport): Promise<void> {
    getManager().save(enrollmentReport);
    getManager().save(enrollmentReport.enrollments);
  }

  public parse(
    enrollmentReportBodyParams: Express.Multer.File
  ): FlattenedEnrollment[] {
    const fileData = readFile(enrollmentReportBodyParams.path, {
      cellDates: true,
    });

    const sheet = Object.values(fileData.Sheets)[0];

    const expectedHeaders = getConnection()
      .getMetadata(FlattenedEnrollment)
      .columns.filter(
        (column) =>
          column.propertyName !== 'id' &&
          column.propertyName !== 'report' &&
          column.propertyName !== 'externalId'
      )
      .map((column) => column.propertyName);

    const parsedSheet = utils.sheet_to_json<FlattenedEnrollment>(sheet, {
      range: this.getStartingRow(sheet),
      header: expectedHeaders,
    });

    return parsedSheet.map((enrollment) =>
      getManager().create(FlattenedEnrollment, enrollment)
    );
  }

  private getStartingRow(sheet: WorkSheet): number {
    // If the second cell in the first row has value 'Child Info'
    // then the sheet has section headers, meaning it is the
    // excel format and data starts on row 3
    // (after section headers, column headers, and column descriptions).
    // Otherwise, it is the csv format and data starts on row 1
    return sheet['B1'].v === 'Child Info' ? 3 : 1;
  }
}
