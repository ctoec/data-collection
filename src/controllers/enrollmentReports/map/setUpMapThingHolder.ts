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

/**
 * A param bag for the mapping process containing:
 * - DB data for mapping, so it can be re-used in each mapping with only one initial lookup
 * - the transaction EntityManager
 * - the request user (needed for utils that get DB entities)
 * - the cache of all mapped children
 */
export type MapThingHolder = {
  transaction: EntityManager;
  user: User;
  organizations: Organization[];
  sites: Site[];
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];

  mappedChildren: Child[];
};

/**
 * Set up mapping param bag by pulling DB values and initializing
 * empty child cache
 * @param transaction
 * @param user
 */
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
