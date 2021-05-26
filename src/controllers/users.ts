import { User, Site, Organization } from '../entity';
import { getManager } from 'typeorm';
import { NotFoundError } from '../middleware/error/errors';

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
  const foundUser = await getManager().findOne(User, id);
  if (!foundUser) throw new NotFoundError();
  return foundUser;
};

export const updateUserName = async (id: string, updatedUser: User) => {
  const foundUser = await getUserById(id);
  foundUser.firstName = updatedUser.firstName;
  foundUser.middleName = updatedUser.middleName;
  foundUser.lastName = updatedUser.lastName;
  foundUser.suffix = updatedUser.suffix;
  await getManager().save(foundUser);
};
