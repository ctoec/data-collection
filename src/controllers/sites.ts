import { User, Site } from '../entity';
import { FindConditions, getManager, In } from 'typeorm';

/**
 * Return all sites the user has access to
 * @param user
 */
export async function getSites(
  user: User,
  organizationId?: number
): Promise<Site[]> {
  let where: FindConditions<Site> = {
    id: In(user.siteIds || []),
  };

  if (!!organizationId) {
    where.organizationId = organizationId;
  }

  return await getManager().find(Site, {
    where,
    relations: ['organization'],
  });
}

/**
 * Determine if all given names for new sites to-be created are
 * free in the DB.
 * @param siteNames 
 * @returns 
 */
export async function areSiteNamesUnique(siteNames: string[]) {
  const foundSites = await getManager().find(
    Site, { where: { siteName: In(siteNames) } }
  )
  return !foundSites?.length;
}