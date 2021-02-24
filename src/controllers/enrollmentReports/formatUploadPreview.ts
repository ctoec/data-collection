import { EnrollmentReportUpdate } from './map/uploadTypes';
import { UploadPreviewRow } from '../../../client/src/containers/Upload/UploadPreviewRow';
import { nameFormatter } from '../../../client/src/utils/formatters';
import {
  getLastEnrollment,
  getLastFunding,
} from '../../../client/src/utils/models';

/**
 * Build the data structure that will map to the table we'll show
 * in the front end that represents a preview of a user's upload.
 * @param mapResult
 */
export const formatUploadPreview = (mapResult: EnrollmentReportUpdate) => {
  const formattedPreview: Partial<UploadPreviewRow>[] = mapResult.children.map(
    (c, idx) => {
      const recentEnrollment = getLastEnrollment(c);
      const recentFunding = getLastFunding(recentEnrollment);
      const tableObj: Partial<UploadPreviewRow> = {
        name: nameFormatter(c, { lastNameFirst: true, capitalize: true }),
        tags: mapResult.changeTagsForChildren[idx],
        birthDate: c.birthdate.format('MM/DD/YYYY'),
        fundingSource: recentFunding
          ? recentFunding.fundingSpace.source
          : ' - ',
        spaceType: recentFunding ? recentFunding.fundingSpace.time : ' - ',
        site: recentEnrollment ? recentEnrollment.site.siteName : ' - ',
        enrollmentDate: recentEnrollment
          ? recentEnrollment.entry.format('MM/DD/YYYY')
          : ' - ',
      };
      return tableObj;
    }
  );
  return formattedPreview;
};
