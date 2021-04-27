import { EnrollmentReportUploadResponse } from '.';
import { Child } from '../../shared/models';

export type EnrollmentColumnError = {
  column: string;
  errorCount: number;
  formattedName: string;
  affectedRows: string[];
};

export interface EnrollmentReportCheckResponse {
  childRecords: Child[];
  columnErrors: EnrollmentColumnError[];
  counts: EnrollmentReportUploadResponse;
}
