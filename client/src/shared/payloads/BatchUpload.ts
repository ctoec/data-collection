import { UploadPreviewTableObject } from '../../containers/Upload/UploadPreviewTableObject';

export interface BatchUpload {
  id?: number;
  new: number;
  updated: number;
  withdrawn: number;
  uploadPreview: UploadPreviewTableObject[];
}
