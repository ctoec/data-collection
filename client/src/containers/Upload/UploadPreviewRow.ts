/**
 * Basic type to hold the properties we want to display in
 * the formatted table that shows a preview of a user's upload
 */
export type UploadPreviewRow = {
  name: string;
  tags: string[];
  missingInfo: boolean;
  birthDate: string;
  fundingSource: string;
  spaceType: string;
  site: string;
  enrollmentDate: string;
};
