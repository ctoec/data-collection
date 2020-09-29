import { User, Site, Organization } from '../entity';
import { getManager } from 'typeorm';

export const addDataToUser = async (user: User) => {
  const [sites, organizations] = await Promise.all([
    getManager().findByIds(Site, user.siteIds || []),
    getManager().findByIds(
      Organization,
      [user.topLevelOrganizationId, ...user.organizationIds] || []
    ),
  ]);

  user.topLevelOrganization = organizations.find(
    (o) => o.id === user.topLevelOrganizationId
  );
  user.sites = sites;
  user.organizations = organizations;
};
