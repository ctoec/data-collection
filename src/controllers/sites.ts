import { User, Site } from '../entity';
import { getManager } from 'typeorm';

export const getSites = async (
  user: User,
  siteIds: number[] = [],
  organizationIds: number[] = [],
  communityIds: number[] = []
) => {
  const allowedOrganizationIds = (user.orgPermissions || []).map(
    (perm) => perm.organizationId
  );
  const allowedCommunityIds = (user.communityPermissions || []).map(
    (perm) => perm.communityId
  );
  const allowedSiteIds = (user.sitePermissions || []).map(
    (perm) => perm.siteId
  );

  // Create query builder for site
  let siteQuery = getManager().createQueryBuilder(Site, 'site');

  // Join on organization to enable community Id check
  // if either user community perms or qs community filter supplied
  siteQuery =
    allowedCommunityIds.length || communityIds.length
      ? siteQuery.leftJoinAndSelect(
          'site.organization',
          'organization',
          'organization.id = site."organizationId"'
        )
      : siteQuery;

  // Add site id filter if user has site-specific access
  siteQuery = allowedSiteIds.length
    ? siteQuery.where('site.id in (:...siteIds)', { siteIds: allowedSiteIds })
    : siteQuery;

  // Add organization id filter if user has organization-specific access
  siteQuery = allowedOrganizationIds.length
    ? siteQuery.orWhere('site."organizationId" in (:...organizationIds)', {
        organizationIds: allowedOrganizationIds,
      })
    : siteQuery;

  // Add community id filter if user has community-specific access
  siteQuery = allowedCommunityIds.length
    ? siteQuery.orWhere('organization."communityId" in (:...communityIds)', {
        communityIds: allowedCommunityIds,
      })
    : siteQuery;

  // Get all allowed sites
  // (apply these user-defined filters after retrieving from DB to ensure
  // user cannot access sites they don't have permissions for)
  let sites = await siteQuery.getMany();
  return sites.filter(
    (site) =>
      (!siteIds.length || siteIds.includes(site.id)) &&
      (!organizationIds.length ||
        organizationIds.includes(site.organizationId)) &&
      (!communityIds.length ||
        communityIds.includes(site.organization.communityId))
  );
};
