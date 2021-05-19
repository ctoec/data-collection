import { User, Site, Organization } from '../entity';
import { getManager } from 'typeorm';

/**
 * Augment a user object with site and organization data.
 * Add all sites the user has access to, as well as any
 * organizations they have access to OR organizations for
 * the allowed sites (users will either have site OR organization
 * level access, but not both)
 * @param user
 */
export const addDataToUser = async (user: User) => {
  const sites =
    user.siteIds && user.siteIds.length
      ? await getManager().findByIds(Site, user.siteIds)
      : [];

  //
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
  const users = await getManager().find(User, { where: { email: email } });
  const usersWithValidEmails = (users || []).filter((u) => u.email && u.email !== "");
  return usersWithValidEmails;
};