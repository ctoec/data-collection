import { User, Site, Provider, Organization } from '../entity';
import { getManager } from 'typeorm';

export const addDataToUser = async (user: User) => {
  const [sites, providers, organizations] = await Promise.all([
    getManager().findByIds(Site, user.siteIds || []),
    getManager().findByIds(Provider, user.providerIds || []),
    getManager().findByIds(Organization, user.organizationIds || []),
  ]);

  user.sites = sites;
  user.provider = providers;
  user.organizations = organizations;
};
