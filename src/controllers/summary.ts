import { SiteSummary } from '../../client/src/shared/payloads/SummaryResponse';
import { getManager } from 'typeorm';
import { Child, OECReport, Organization, User } from '../entity';

export async function getProviderUserCount(): Promise<number> {
  return getManager().count(User, { where: { isAdmin: false } });
}

export async function getOrganizationCount(): Promise<number> {
  return getManager().count(Organization);
}

export async function getChildCount(): Promise<number> {
  return getManager().count(Child);
}

export async function getSiteSummaries(): Promise<SiteSummary[]> {
  return getManager().query(`
		SELECT s.id as siteId, s.siteName, o.id as organizationId, o.providerName, r.updatedAt, count(*) as totalEnrollments
		FROM site s
		JOIN organization o ON s.organizationid = o.id
		LEFT JOIN oec_report r ON r.organizationid = o.id
		JOIN enrollment e ON s.id = e.siteId
		WHERE e.deleteddate is null
		GROUP BY s.id, s.siteName, o.id, o.providerName, r.updatedAt
	`);
}

export async function getOECReports(): Promise<OECReport[]> {
  return getManager().find(OECReport);
}
