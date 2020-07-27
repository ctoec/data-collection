import { EnrollmentReport, FlattenedEnrollment } from '../../models';
import { enrollmentReports } from '../../data/enrollmentReports';
import { readFile, utils, WorkSheet } from 'xlsx';

/**
 * @TODO Connect to DB
 */
export class ReportService {
  public get(id: number): EnrollmentReport {
    return enrollmentReports.find((r) => r.id === id);
  }

  public save(enrollmentReport: EnrollmentReport): void {
    enrollmentReports.push(enrollmentReport);
    return;
  }

  public parse(
    enrollmentReportBodyParams: Express.Multer.File
  ): FlattenedEnrollment[] {
    const fileData = readFile(enrollmentReportBodyParams.path);

    const sheet = Object.values(fileData.Sheets)[0];

    const startingRow = this.getStartingRow(sheet);

    const parsedSheet = utils.sheet_to_json<FlattenedEnrollment>(sheet, {
      range: startingRow,
    });

    return parsedSheet;
  }

  private getStartingRow(sheet: WorkSheet): number {
    // Check if the sheet matches the Excel template
    // By comparing the value in the first cell.
    // We want to skip the first row if this is the
    // Excel template. Otherwise, start at the first
    // row.
    return sheet['A1'].v === 'Child Info' ? 1 : 0;
  }
}
