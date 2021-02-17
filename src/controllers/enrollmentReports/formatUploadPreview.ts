import { MapResult } from './map/uploadTypes';
import { UploadPreviewTableObject } from '../../../client/src/containers/Upload/UploadPreviewTableObject';
import { nameFormatter } from '../../../client/src/utils/formatters';
import {
  getLastEnrollment,
  getLastFunding,
} from '../../../client/src/utils/models';

export const formatUploadPreview = (mapResult: MapResult) => {
  const formattedPreview: Partial<UploadPreviewTableObject>[] = mapResult.children.map(
    (c, idx) => {
      const recentEnrollment = getLastEnrollment(c);
      const recentFunding = getLastFunding(recentEnrollment);
      const tableObj: Partial<UploadPreviewTableObject> = {
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
