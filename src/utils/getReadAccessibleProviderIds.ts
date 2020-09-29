import { User, Site } from '../entity';
import { getManager } from 'typeorm';

/**
 * Gets all orgIds that the user has READ access to -- that is,
 * all orgIds they have permissions for, and all orgIds for sites
 * that they have permissions for.
 * @param user
 */
export const getReadAccessibleProviderIds = async (user: User) => {
  // get org ids for all permitted sites
  const siteProviderIds = (
    await getManager().findByIds(Site, user.siteIds || [])
  ).map((site) => site.providerId);

  // combine and deduplicate site org Ids + org Ids
  return Array.from(new Set([...siteProviderIds, ...user.providerIds]));
};
