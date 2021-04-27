import { Organization, Child } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { Brackets } from 'typeorm';
import { TransactionMetadata } from '../mapRows';
import { getChildById } from '../../../children';

/**
 * Queries the database for a child record that matches the row on:
 * - firstname
 * - lastname
 * - birthdate
 * - sasid or unique id if it is present in the row
 * 	(note: this means you cannot update a record to include a new uniqueId via batch upload)
 * @param row
 * @param organization
 * @param transactionMetadata
 */
export const getChildMatchFromDB = async (
  row: EnrollmentReportRow,
  organization: Organization,
  transactionMetadata: TransactionMetadata
) => {
  const dbMatchQuery = transactionMetadata.transaction
    .createQueryBuilder(Child, 'child')
    .where('organizationId = :organizationId', {
      organizationId: organization.id,
    })
    .andWhere('firstname = :firstname', { firstname: row.firstName })
    .andWhere('lastname = :lastname', { lastname: row.lastName })
    .andWhere('birthdate = :birthdate', {
      birthdate: row.birthdate?.format('YYYY-MM-DD'),
    });

  if (row.sasidUniqueId) {
    dbMatchQuery.andWhere(
      new Brackets((qb) =>
        qb
          .where('sasid = :sasidUniqueId', {
            sasidUniqueId: row.sasidUniqueId,
          })
          .orWhere('uniqueId = :sasidUniqueId', {
            sasidUniqueId: row.sasidUniqueId,
          })
      )
    );
  }

  const match = await dbMatchQuery.getOne();
  const childRecord = match
    ? await getChildById(match.id, transactionMetadata.user)
    : null;

  return childRecord ? { ...childRecord, tags: [] } : null;
};

/**
 * Looks in the mappedChildren cache for a record that matches the row on:
 * - firstname
 * - lastname
 * - birthdates
 * - sasid or unique id if it is present in the row
 * @param row
 * @param organization
 * @param transactionMetadata
 */
export const getChildMatchFromCache = (
  row: EnrollmentReportRow,
  organization: Organization,
  childRecordsCache: Child[]
) =>
  childRecordsCache.find(
    (child) =>
      row.firstName === child.firstName &&
      row.lastName === child.lastName &&
      organization.id === child.organizationId &&
      row.birthdate.toISOString() === child.birthdate.toISOString() &&
      (row.sasidUniqueId
        ? row.sasidUniqueId === child.sasid ||
          row.sasidUniqueId === child.uniqueId
        : true)
  );
