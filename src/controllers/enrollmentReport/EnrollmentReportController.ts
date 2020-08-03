import { Controller, Get, Post, Request, Route, Security } from 'tsoa';
import { EnrollmentReportService } from '../../services/enrollmentReport/EnrollmentReportService';
import multer from 'multer';
import path from 'path';
import { EnrollmentReport } from '../../entity';

@Route('enrollment-reports')
export class ReportController extends Controller {
  _service = new EnrollmentReportService();

  @Security('jwt')
  @Get('{reportId}')
  public async getEnrollmentReportById(
    reportId: number
  ): Promise<EnrollmentReport> {
    return this._service.get(reportId);
  }

  // TODO Consider returning structured enrollments in the report
  @Security('jwt')
  @Post('')
  public async createEnrollmentReport(
    @Request() req: Express.Request
  ): Promise<EnrollmentReport> {
    await this.handleFile(req);
    const flattenedEnrollments = this._service.parse(req.file);

    const report = new EnrollmentReport();
    report.enrollments = flattenedEnrollments;

    console.log(flattenedEnrollments);
    await this._service.save(report);
    return report;
  }

  private async handleFile(req: Express.Request): Promise<any> {
    const uploadedFileHandler = multer({
      dest: path.join('/tmp/uploads'),
    }).single('file');
    return new Promise((resolve, reject) => {
      uploadedFileHandler(req as any, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
