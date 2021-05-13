import { Organization } from "../entity";
import { getManager } from "typeorm";
import { ResourceConflictError } from "../middleware/error/errors";

async function doesOrgNameExist(name: string) {
  const existing = await getManager().findOne(
    Organization,
    { where: { providerName: name }}
  );
  return !!existing;
};

export async function createOrganization(name: string) {
  const nameExists = await doesOrgNameExist(name);
  if (nameExists) throw new ResourceConflictError('Name already exists.');
  await getManager().save(
    getManager().create(Organization, { providerName: name })
  );
}

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
