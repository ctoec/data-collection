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

  return getManager().find(Site, {
    where,
    relations: ['organization'],
  });
}
