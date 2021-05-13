import { Organization, Site } from "../entity";
import { getManager } from "typeorm";
import { ResourceConflictError } from "../middleware/error/errors";
import * as siteController from '../controllers/sites';
import { NewSite } from "../../client/src/shared/models";

async function doesOrgNameExist(name: string) {
  const existing = await getManager().findOne(
    Organization,
    { where: { providerName: name }}
  );
  return !!existing;
};

export async function createOrganization(name: string, sites: NewSite[]) {

  // All or nothing approach to creating new orgs, so if either the
  // org name is taken or *any* site name is taken, fail the whole thing
  const orgNameExists = await doesOrgNameExist(name);
  if (orgNameExists) throw new ResourceConflictError('Name already exists.');
  const siteNamesAllUnique = await siteController.areSiteNamesUnique(
    sites.map((newSite) => newSite.name)
  );
  if (!siteNamesAllUnique) throw new ResourceConflictError('A site name is already taken.');

  // Create org first so we can give its ID to created sites
  const newOrg = await getManager().save(
    getManager().create(Organization, { providerName: name })
  );
  const createdSites: Site[] = await Promise.all(sites.map(
    async (s: NewSite) => await getManager().save(
      getManager().create(Site, {
        siteName: s.name,
        titleI: s.titleI,
        region: s.region,
        naeycId: parseInt(s.naeycId),
        registryId: parseInt(s.registryId),
        licenseNumber: parseInt(s.licenseNumber),
        facilityCode: parseInt(s.facilityCode),
        organization: newOrg,
        organizationId: newOrg.id,
      })
    )
  ));
  newOrg.sites = createdSites;
  await getManager().save(newOrg);
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
