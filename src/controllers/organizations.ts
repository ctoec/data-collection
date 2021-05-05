import { User, Organization } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { OrganizationSummary } from '../../client/src/shared/payloads/OrganizationsResponse';

/**
 * Get all organizations a given user has access to,
 * with a count of sites and a list of funding sources
 * @param user
 */
export const getOrganizations = async (
  user: User,
  organizationIds?: string[]
): Promise<Organization[]> => {
  if (!organizationIds?.length)
    organizationIds = await getReadAccessibleOrgIds(user);

  console.log('&^%%^&%^&^%^&organizationIds', organizationIds);

  return getManager().query(
    `select o.id, o.providername AS providerName, s.siteCount, string_agg(fs.source, ',') as fundingSource
from organization o left join (
    select distinct organizationid, source
    from funding_space
) fs on o.id = fs.organizationId left join (
        select organizationid, count(*) as siteCount
        from site
        group by organizationid
        ) s on fs.organizationid = s.organizationId
group by o.id, o.providername, s.siteCount`
  );
};
