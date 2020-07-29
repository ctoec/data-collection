import { EnrollmentReport, FlattenedEnrollment } from '../../entity';
import { enrollmentReports } from '../../data/enrollmentReports';
import { readFile, utils, WorkSheet } from 'xlsx';
import { getManager, getConnection } from 'typeorm';

/**
 * @TODO Connect to DB
 */
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
    const fileData = readFile(enrollmentReportBodyParams.path);

    const sheet = Object.values(fileData.Sheets)[0];

    const expectedHeaders = getConnection()
      .getMetadata(FlattenedEnrollment)
      .columns.filter(
        (column) =>
          column.propertyName !== 'id' && column.propertyName !== 'report'
      )
      .map((column) => column.propertyName);

    const parsedSheet = utils.sheet_to_json<FlattenedEnrollment>(sheet, {
      range: 1,
      header: expectedHeaders,
    });

    return parsedSheet.map((enrollment) =>
      getManager().create(FlattenedEnrollment, enrollment)
    );
  }
}
