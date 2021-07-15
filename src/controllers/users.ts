import {
  User,
  Site,
  Organization,
  OrganizationPermission,
  SitePermission,
} from '../entity';
import { getManager } from 'typeorm';
import { NotFoundError } from '../middleware/error/errors';
import { uniq } from 'underscore';
import { mapUserPermsToIds } from '../utils/mapPermsToIds';

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

  // Need to append organizations for which the user can just
  // access sites, too, so that they can be edited in the front-end
  const orgIds = uniq(
    (user.organizationIds || []).concat(sites.map((s) => s.organizationId))
  );

  const organizations = orgIds.length
    ? await getManager().findByIds(Organization, orgIds)
    : [];

  user.sites = sites;
  user.organizations = organizations;
};

export const getUsers = async (): Promise<User[]> =>
  getManager().query(
    `SELECT
      u.id,
      concat(u.lastName, ', ', u.firstName) as name,
      u.email,
      string_agg(o.providerName, ', ') as organizations
    FROM [user] u
    LEFT JOIN (
        select op.organizationId, op.userId from organization_permission op
        union
        select o.id as organizationId, sp.userId
        from site_permission sp
            join site s on sp.siteId = s.id
            join organization o on s.organizationId = o.id
    ) op on u.id = op.userId
    LEFT JOIN organization o on op.organizationId = o.id
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
    relations: ['orgPermissions', 'sitePermissions'],
  });
  if (!foundUser) throw new NotFoundError();
  await mapUserPermsToIds(foundUser);
  await addSiteAndOrgDataToUser(foundUser);
  return foundUser;
};

/**
 * Updates the identifying and permission information for a user.
 * Admins can change identifiers such as first and last name. To
 * make permission updating easier, all of the user's old permissions
 * are first wiped from the DB (to simplify the amount of diff case
 * logic required), and then all permissions carried on the updated
 * version of the user object are written.
 * @param id
 * @param updatedUser
 */
export const updateUser = async (id: string, updatedUser: User) => {
  const foundUser = await getUserById(id);
  foundUser.firstName = updatedUser.firstName;
  foundUser.middleName = updatedUser.middleName;
  foundUser.lastName = updatedUser.lastName;
  foundUser.suffix = updatedUser.suffix;

  const newOrgPerms = [];
  const newSitePerms = [];
  const orgsInUpdatedUser = await getManager().findByIds(
    Organization,
    updatedUser.organizations.map((o) => o.id),
    { relations: ['sites'] }
  );

  updatedUser.organizations.forEach((newOrg) => {
    const relevantOrg = orgsInUpdatedUser.find(
      (o) => o.providerName === newOrg.providerName
    );
    const allSitesPresent = relevantOrg.sites.every((s) =>
      updatedUser.sites.some((uSite) => uSite.id === s.id)
    );
    // Access to all sites means it's an org level user
    if (allSitesPresent) {
      newOrgPerms.push(newOrg.id);
    }
    // Otherwise, just give them the sites they have
    else {
      updatedUser.sites.forEach((s) => {
        if (
          relevantOrg.sites.some(
            (relevantSite) => relevantSite.siteName === s.siteName
          )
        ) {
          newSitePerms.push(s.id);
        }
      });
    }
  });

  await getManager().transaction(async (tManager) => {
    await tManager.save(foundUser);
    await tManager.delete(OrganizationPermission, { user: foundUser });
    await tManager.delete(SitePermission, { user: foundUser });

    // Note: Can't use a forEach loop here because they're not async/
    // await compatible (they don't wait for their anonymous funcs to
    // finish)
    for (const newOrgId of newOrgPerms) {
      const newPerm = tManager.create(OrganizationPermission, {
        userId: foundUser.id,
        organizationId: newOrgId,
      });
      await tManager.save(newPerm);
    }
    for (const newSiteId of newSitePerms) {
      const newPerm = tManager.create(SitePermission, {
        userId: foundUser.id,
        siteId: newSiteId,
      });
      await tManager.save(newPerm);
    }
  });
};
