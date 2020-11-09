import { Site } from '../../../entity';
import { EnrollmentReportRow } from '../../../template';

/**
 * Look up site from user's sites that matches source site name,
 * and belongs to the organization indiated in the source row.
 *
 * @param source
 */
export const lookUpSite = (
  source: EnrollmentReportRow,
  organizationId: number,
  sites: Site[]
) => {
  if (!source.site) return;

  return sites.find(
    (site) =>
      site.siteName.toLowerCase() === source.site.toLowerCase() &&
      site.organizationId === organizationId
  );
};
