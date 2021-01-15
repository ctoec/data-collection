import { Site } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { normalizeString } from '../../../../utils/normalizeString';

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
      normalizeString(site.siteName) === normalizeString(source.site) &&
      site.organizationId === organizationId
  );
};
