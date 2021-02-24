import { UploadPreviewRow } from '../../containers/Upload/UploadPreviewRow';

export interface BatchUploadResponse {
  id?: number;
  new: number;
  updated: number;
  withdrawn: number;
  uploadPreview: UploadPreviewRow[];
}
