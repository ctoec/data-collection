import {
  SiteSummary,
  SummaryResponse,
} from '../../client/src/shared/payloads/SummaryResponse';
import { getManager } from 'typeorm';
import { Child, Organization, User } from '../entity';

export async function getSummaryResponse(): Promise<SummaryResponse> {
  const sites = await getSiteSummaries();
  const summaryResponse: SummaryResponse = {
    totalProviderUsers: await getProviderUserCount(),
    totalOrganizations: await getOrganizationCount(),
    totalChildren: await getChildCount(),
    siteSummaries: sites.reduce(
      (_siteSummaries, site) => {
        if (!!site.submissionDate) {
          _siteSummaries.completedSites.push(site);
        } else if (site.totalEnrollments > 0) {
          _siteSummaries.inProgressSites.push(site);
        } else {
          _siteSummaries.noDataSites.push(site);
        }
        return _siteSummaries;
      },
      { completedSites: [], inProgressSites: [], noDataSites: [] }
    ),
  };

  return summaryResponse;
}

async function getProviderUserCount(): Promise<number> {
  return getManager().count(User, { where: { isAdmin: false } });
}

async function getOrganizationCount(): Promise<number> {
  return getManager().count(Organization);
}

async function getChildCount(): Promise<number> {
  return (
    getManager()
      .createQueryBuilder(Child, 'Child')
      .leftJoinAndSelect('Child.enrollments', 'enrollment')
      .where('enrollment.deletedDate IS NULL')
      // Only count children who are associated with a current enrollment
      .andWhere('enrollment.exit IS NULL')
      .getCount()
  );
}

async function getSiteSummaries(): Promise<SiteSummary[]> {
  return getManager().query(`
		SELECT 
			s.id as siteId,
			s.siteName,
			o.id as organizationId,
			o.providerName,
			r.updatedAt as submissionDate,
			SUM (
				CASE 
					WHEN e.id IS NOT NULL THEN 1
					ELSE 0
				END
			) as totalEnrollments
		FROM site s
		JOIN organization o ON s.organizationid = o.id
		LEFT JOIN oec_report r ON r.organizationid = o.id
		LEFT JOIN enrollment e ON s.id = e.siteId
		WHERE e.deleteddate is null
		GROUP BY s.id, s.siteName, o.id, o.providerName, r.updatedAt
	`);
}
