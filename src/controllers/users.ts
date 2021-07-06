import { User, Site, Organization, OrganizationPermission, SitePermission } from '../entity';
import { getManager, In } from 'typeorm';
import { NotFoundError } from '../middleware/error/errors';

/**
 * Fills out the organization and site ID fields on a user object
 * by mapping any linked permissions to their respective IDs.
 * SiteIDs are comprehensively generated by supplementing the user's
 * sitePerms with all sites under the purview of organizations the
 * user can also access.
 */
const mapUserPermsToIds = async (user: User) => {

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
  return user;
}

/**
 * Augment a user object with site and organization data.
 * Add all sites the user has access to, as well as any
 * organizations they have access to OR organizations for
 * the allowed sites (users will either have site OR organization
 * level access, but not both)
 * @param user
 */
export const addSiteAndOrgDataToUser = async (user: User) => {
  const sites =
    user.siteIds && user.siteIds.length
      ? await getManager().findByIds(Site, user.siteIds)
      : [];

  const orgIds =
    user.organizationIds && user.organizationIds.length
      ? user.organizationIds
      : sites.map((s) => s.organizationId);

  const organizations = orgIds.length
    ? await getManager().findByIds(Organization, orgIds)
    : [];

  user.sites = sites;
  user.organizations = organizations;
};

/**
 * TODO: Currently, this function only returns users who have existing
 * organization permissions. Which means the admin view table of users
 * will only show users who already have permissions set. That seems
 * like not what we want to do, right? (Example: a user currently has
 * only site perms, but should have perms for their whole org; this
 * query wouldn't return the user. Example 2: an admin mistakenly
 * forgot to give a user any permissions at all when creating their
 * account. That user won't show up here so that the situation can be
 * fixed.)
 */
export const getUsers = async (): Promise<User[]> =>
  getManager().query(
    `SELECT 
      u.id,
      concat(u.lastName, ', ', u.firstName) as name,
      u.email,
      string_agg(o.providerName, ', ') as organizations
    FROM [user] u
    JOIN organization_permission op on u.id = op.userId
    JOIN organization o on op.organizationId = o.id
    GROUP BY u.id, u.lastName, u.firstName, u.email`
  );

  /**
   * Finds all users in the DB whose email is an exact match
   * for the provided string.
   */
export const getUsersByEmail = async (email: string) => {
  const users = await getManager().find(User, { where: { email } });
  return users;
};

export const getUserById = async (id: string) => {
  let foundUser = await getManager().findOne(User, id, {
    relations: ['orgPermissions', 'sitePermissions'] }
  );
  if (!foundUser) throw new NotFoundError();
  await mapUserPermsToIds(foundUser);
  await addSiteAndOrgDataToUser(foundUser);
  return foundUser;
};

export const updateUser = async (id: string, updatedUser: User) => {
  const foundUser = await getUserById(id);
  foundUser.firstName = updatedUser.firstName;
  foundUser.middleName = updatedUser.middleName;
  foundUser.lastName = updatedUser.lastName;
  foundUser.suffix = updatedUser.suffix;

  const newOrgPerms = [];
  const newSitePerms = [];
  const orgPermsToDelete = [];
  const sitePermsToDelete = [];
  const orgsInUpdatedUser = await getManager().findByIds(Organization, updatedUser.organizations.map(o => o.id), { relations: ['sites']});

  updatedUser.organizations.forEach((newOrg) => {
    const relevantOrg = orgsInUpdatedUser.find((o) => o.providerName === newOrg.providerName);
    const allSitesPresentInUpdate = relevantOrg.sites.every((s) => updatedUser.sites.some((uSite) => uSite.id === s.id));
    const allSitesPresentInOriginal = relevantOrg.sites.every((s) => foundUser.sites.some((fSite) => fSite.id === s.id));

    // New org that's been added
    if (!foundUser.organizations.some((foundOrg) => foundOrg.providerName === newOrg.providerName)) {
      // All sites present -> user should have org access here
      if (allSitesPresentInUpdate) {
        newOrgPerms.push(newOrg.id);
      }
      else {
        updatedUser.sites.forEach((s) => {
          newSitePerms.push(s.id);
        });
      }
    }

    // User already connected to this org in some way
    else {
      if (allSitesPresentInUpdate && !allSitesPresentInOriginal) {
        // Replace existing site perms with single org perm
        foundUser.sites.forEach((s) => {
          sitePermsToDelete.push(s.id);
        });
        newOrgPerms.push(newOrg.id);
      }
      else if (!allSitesPresentInUpdate && allSitesPresentInOriginal) {
        // Remove old org perm and replace with new site perms
        orgPermsToDelete.push(newOrg.id);
        updatedUser.sites.forEach((s) => {
          newSitePerms.push(s.id);
        });
      }
      else {
        // Find the diff and update accordingly
        foundUser.sites.forEach(async (siteToDelete) => {
          if (!updatedUser.sites.some((s) => siteToDelete.id === s.id)) {
            sitePermsToDelete.push(siteToDelete.id);
          }
        });
        updatedUser.sites.forEach(async (updatedSite) => {
          if (!foundUser.sites.some((s) => s.id === updatedSite.id)) {
            newSitePerms.push(updatedSite.id);
          }
        });
      }
    }
  });

  // Now check if there are any orgs that were deleted entirely from the user
  foundUser.organizations.forEach((o) => {
    if (!updatedUser.organizations.some(uOrg => uOrg.providerName === o.providerName)) {
      const allSitesPresentInOriginal = o.sites.every(
        (s) => foundUser.sites.some((fSite) => fSite.id === s.id)
      );
      // User had org permissions, so remove them
      if (allSitesPresentInOriginal) {
        orgPermsToDelete.push(o.id);
      }
      // Otherwise, just remove all the sites they had
      else {
        foundUser.sites.forEach((s) => {
          if (s.organizationId === o.id) {
            sitePermsToDelete.push(s.id);
          }
        })
      }
    }
  });

  await getManager().delete(OrganizationPermission, { user: foundUser, organizationId: In(orgPermsToDelete)});
  await getManager().delete(SitePermission, { user: foundUser, siteId: In(sitePermsToDelete)});
  newOrgPerms.forEach(async (newOrgId) => {
    const newPerm = await getManager().create(OrganizationPermission, { user: foundUser, organizationId: newOrgId })
    foundUser.orgPermissions.push(newPerm);
  });
  newSitePerms.forEach(async (newSiteId) => {
    const newPerm = await getManager().create(SitePermission, { user: foundUser, siteId: newSiteId });
    foundUser.sitePermissions.push(newPerm);
  });
  
  await getManager().save(foundUser);
};
