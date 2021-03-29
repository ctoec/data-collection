import { Request, Response } from 'express';
import { User, Site, Organization } from '../entity';
import { getManager } from 'typeorm';
import { BadRequestError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';

export { getCurrentUser, updateCurrentUser };

/**
 * Returns the user associated with the
 * authenticated request, augmented with all
 * read/write sites and orgs
 */
const getCurrentUser = async (req: Request, res: Response) => {
  const user: User = req.user;
  await addDataToUser(user);
  res.send(user);
};

const updateCurrentUser = passAsyncError(
  async (req: Request, res: Response) => {
    try {
      const user: User = req.user;
      const updatedUser = getManager().merge(User, user, req.body);
      await getManager().save(updatedUser);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      throw new BadRequestError('User information not saved.');
    }
  }
);

//////////////////////////////////////////////////////////////

/**
 * Augment a user object with site and organization data.
 * Add all sites the user has access to, as well as any
 * organizations they have access to OR organizations for
 * the allowed sites (users will either have site OR organization
 * level access, but not both)
 * @param user
 */
async function addDataToUser(user: User) {
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
}
