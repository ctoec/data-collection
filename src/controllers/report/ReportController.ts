import { Controller, Get, Post, Request, Route, Security } from 'tsoa';
import { ReportService } from '../../services/report/ReportService';
import multer from 'multer';
import path from 'path';
import { EnrollmentReport } from '../../models';

@Route('reports')
export class ReportController extends Controller {
  @Security('jwt')
  @Get('{reportId}')
  public async getReportById(reportId: number): Promise<EnrollmentReport> {
    return new ReportService().get(reportId);
  }

  // TODO Consider returning structured enrollments in the report
  @Security('jwt')
  @Post('')
  public async createReport(
    @Request() req: Express.Request
  ): Promise<EnrollmentReport> {
    await this.handleFile(req);
    const reportService = new ReportService();
    const flattenedEnrollments = reportService.parse(req.file);
    const report = {
      id: 1,
      enrollments: flattenedEnrollments,
    };
    reportService.save(report);
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
