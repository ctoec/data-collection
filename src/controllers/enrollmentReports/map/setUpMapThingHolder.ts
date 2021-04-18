import {
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod,
  Child,
  User,
} from '../../../entity';
import { getReadAccessibleOrgIds } from '../../../utils/getReadAccessibleOrgIds';
import { EntityManager, In } from 'typeorm';

export type MapThingHolder = {
  transaction: EntityManager;
  user: User;
  organizations: Organization[];
  sites: Site[];
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];

  mappedChildren: Child[];
};

export const setUpThingHolder = async (
  transaction: EntityManager,
  user: User
) => {
  const readAccessibleOrgIds = await getReadAccessibleOrgIds(user);
  const [
    organizations,
    sites,
    fundingSpaces,
    reportingPeriods,
  ] = await Promise.all([
    transaction.findByIds(Organization, readAccessibleOrgIds),
    transaction.findByIds(Site, user.siteIds),
    transaction.find(FundingSpace, {
      where: { organizationId: In(readAccessibleOrgIds) },
    }),
    transaction.find(ReportingPeriod),
  ]);

  return {
    transaction,
    user,
    organizations,
    sites,
    fundingSpaces,
    reportingPeriods,
    mappedChildren: [],
  };
};
