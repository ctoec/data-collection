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
  newCount: number;
  updatedCount: number;
  withdrawnCount: number;
}
