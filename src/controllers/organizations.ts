import { getManager, ILike } from 'typeorm';
import { Organization, Site, FundingSpace } from '../entity';
import { ResourceConflictError } from '../middleware/error/errors';
import * as siteController from '../controllers/sites';

async function doesOrgNameExist(name: string) {
  const existing = await getManager().findOne(Organization, {
    where: { providerName: name },
  });
  return !!existing;
}

export async function createOrganization(
  name: string,
  sites: Partial<Site>[],
  fundingSpaces: Partial<FundingSpace>[]
) {
  // All or nothing approach to creating new orgs, so if either the
  // org name is taken or *any* site name is taken, fail the whole thing
  const orgNameExists = await doesOrgNameExist(name);
  if (orgNameExists)
    throw new ResourceConflictError('Organization name already exists.');
  const siteNamesAllUnique = await siteController.areSiteNamesUnique(
    sites.map((newSite) => newSite.siteName)
  );
  if (!siteNamesAllUnique)
    throw new ResourceConflictError('One or more site names already exists.');

  // Create org first so we can give its ID to created sites
  const newOrg = await getManager().save(
    getManager().create(Organization, { providerName: name })
  );
  const createdSites: Site[] = await Promise.all(
    sites.map(
      async (s: Partial<Site>) =>
        await getManager().save(
          getManager().create(Site, {
            siteName: s.siteName,
            titleI: s.titleI,
            region: s.region,
            naeycId: s.naeycId,
            registryId: s.registryId,
            licenseNumber: s.licenseNumber,
            facilityCode: s.facilityCode,
            organization: newOrg,
            organizationId: newOrg.id,
          })
        )
    )
  );
  newOrg.sites = createdSites;

  const createdFundingSpaces: FundingSpace[] = await Promise.all(
    fundingSpaces.map(
      async (f: Partial<FundingSpace>) =>
        await getManager().save(
          getManager().create(FundingSpace, {
            source: f.source,
            ageGroup: f.ageGroup,
            capacity: f.capacity,
            time: f.time,
            organizationId: newOrg.id,
          })
        )
    )
  );
  newOrg.fundingSpaces = createdFundingSpaces;

  await getManager().save(newOrg);
}

/**
 * Get all organizations a given user has access to,
 * with a count of sites and a list of funding sources
 * @param user
 */
export const getOrganizations = async (query): Promise<Organization[]> =>
  query.name ? getOrgsByName(query.name) : getAllAccessibleOrgs();

const escapeLikeString = (raw: string): string =>
  raw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s\\]/g, '%');

const getOrgsByName = (name: string) =>
  getManager().find(Organization, {
    where: { providerName: ILike(`%${escapeLikeString(name)}%`) },
  });

const getAllAccessibleOrgs = () =>
  getManager().query(
    `select o.id, o.providername AS providerName, s.siteCount, string_agg(fs.source, ',') as fundingSource
    from organization o left join (
        select distinct organizationid, source
        from funding_space
    ) fs on o.id = fs.organizationId left join (
            select organizationid, count(*) as siteCount
            from site
            group by organizationid
            ) s on o.id = s.organizationId
    group by o.id, o.providername, s.siteCount`
  );
