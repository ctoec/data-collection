import { getManager, In } from "typeorm";
import { Site, User } from "../entity";

/**
 * Fills out the organization and site ID fields on a user object
 * by mapping any linked permissions to their respective IDs.
 * SiteIDs are comprehensively generated by supplementing the user's
 * sitePerms with all sites under the purview of organizations the
 * user can also access.
 */
 export const mapUserPermsToIds = async (user: User) => {

  // Get all orgs the user has access to, and then use those
  // to find all sites the user has access to
  const orgIds = (user.orgPermissions || []).map(
    (perm) => perm.organizationId
  );
  const sitesFromOrgs = orgIds.length
    ? await getManager().find(Site, {
        where: { organizationId: In(orgIds) },
      })
    : [];

  // Make the collection we got from searching by org distinct
  const distinctSiteIds = Array.from(
    new Set([
      ...(user.sitePermissions || []).map((perm) => perm.siteId),
      ...sitesFromOrgs.map((site) => site.id),
    ])
  );

  // Augment and return the user object
  user.organizationIds = orgIds;
  user.siteIds = distinctSiteIds;
}