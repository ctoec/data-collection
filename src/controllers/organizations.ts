import { Organization } from '../entity';
import { getManager, In } from 'typeorm';

/**
 * Get all organizations a given user has access to,
 * with a count of sites and a list of funding sources
 * @param user
 */
export const getOrganizations = async (): Promise<Organization[]> =>
  getManager().query(
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
