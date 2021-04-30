import { EntityManager, In, getManager } from 'typeorm';
import { EnrollmentReportRow } from '../../../template';
import {
  lookUpOrganization,
  getChildMatchFromCache,
  getChildMatchFromDB,
} from './utils';
import { ApiError } from '../../../middleware/error/errors';
import { createRecord } from './createRecord';
import { updateRecord } from './updateRecord';
import {
  Child,
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod,
  User,
} from '../../../entity';
import { getReadAccessibleOrgIds } from '../../../utils/getReadAccessibleOrgIds';
import { validateChild } from '../../../utils/validateChild';

/**
 * A param bag for the mapping process containing:
 * - DB data for mapping, so it can be re-used in each mapping with only one initial lookup
 * - the transaction EntityManager
 * - the request user (needed for utils that get DB entities)
 * - the cache of all mapped children
 */
export type TransactionMetadata = {
  transaction: EntityManager;
  user: User;
  organizations: Organization[];
  sites: Site[];
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];
};

/**
 * Set up mapping param bag by pulling DB values and initializing
 * empty child cache
 * @param transaction
 * @param user
 */
export const getTransactionData = async (
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
  };
};

export const mapRows = async (
  transaction: EntityManager,
  user: User,
  rows: EnrollmentReportRow[]
) => {
  const transactionMetadata = await getTransactionData(transaction, user);
  const childRecordsCache = [];

  for (const row of rows) {
    try {
      const organization = lookUpOrganization(row, transactionMetadata);

      // Check for cache match
      const cacheMatch = getChildMatchFromCache(
        row,
        organization,
        childRecordsCache
      );
      if (cacheMatch) {
        // Cache match: update existing record
        updateRecord(row, cacheMatch, transactionMetadata);
        continue;
      }

      // Else: check DB match
      const dbMatch = await getChildMatchFromDB(
        row,
        organization,
        transactionMetadata
      );
      if (dbMatch) {
        // DB match: update existing record, add to cache
        updateRecord(row, dbMatch, transactionMetadata);
        childRecordsCache.push(dbMatch);
        continue;
      }

      // Finally, else: no match, so create and add to cache
      const newRecord = await createRecord(
        row,
        organization,
        transactionMetadata
      );
      childRecordsCache.push(newRecord);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.error('Error occured parsing row:', err);
    }
  }

  /**
   * This should not be necessary.
   * We need `validateChild` to add validation errors to the records in memory.
   * It uses `class-validator`, which requires that objects be class-instantiated.
   * `typeorm` only allows us to do that through `create`.
   * Doing so destroys the `tags` built on the object.
   * So:
   * 1. class instantiate `create`, 2. preserve `tags`, 3. then `validateChild`.
   */
  return await Promise.all(
    childRecordsCache.map((childRecord) => {
      const classifiedChild = getManager().create(Child, childRecord);
      classifiedChild.tags = childRecord.tags;
      return validateChild(classifiedChild);
    })
  );
};
