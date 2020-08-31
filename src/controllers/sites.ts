import { User, Site, Organization } from '../entity';
import { getManager } from 'typeorm';

/**
 * Return all sites the user has access to
 * @param user
 */
export const getSites = async (user: User) => {
  return (
    await getManager().findByIds(Site, user.siteIds || []),
    {
      relations: ['organization'],
    }
  );
};
