import { EnrollmentReportUploadResponse } from '.';
import { UploadPreviewRow } from '../../containers/Upload/UploadPreviewRow';

export type EnrollmentColumnError = {
  column: string;
  errorCount: number;
  formattedName: string;
  affectedRows: string[];
};

export interface EnrollmentReportCheckResponse {
  uploadPreview: UploadPreviewRow[];
  columnErrors: EnrollmentColumnError[];
  counts: EnrollmentReportUploadResponse;
}
