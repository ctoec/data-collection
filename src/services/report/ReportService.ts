import { readFileSync } from 'fs';
import { EnrollmentReport } from '../../models/enrollmentReport';
import { enrollmentReports } from '../../data/enrollmentReports';

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
  ): EnrollmentReport {
    const fileData = readFileSync(enrollmentReportBodyParams.path, 'utf-8');
    // TODO Parse file data
    return {
      id: Math.ceil(Math.random() * 100000000),
      enrollments: [],
    };
  }
}
