import { User, Site, Provider } from '../entity';
import { getManager } from 'typeorm';

export const addDataToUser = async (user: User) => {
  const [sites, organizations] = await Promise.all([
    getManager().findByIds(Site, user.siteIds || []),
    getManager().findByIds(Provider, user.providerIds || []),
  ]);

  user.sites = sites;
  user.provider = organizations;
};
