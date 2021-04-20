import { getChildById } from '../../../children';
import { Organization, Child } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { Brackets } from 'typeorm';
import { MapThingHolder } from '../setUpMapThingHolder';

/**
 * Looks for an existing match for the child from the given EnrollmentReportRow
 * in the in-memory mappedChild cache, and upon failure in the database.
 *
 * If a database match is found, it is added to the mappedChildren cache.
 *
 * @param row
 * @param organization
 * @param thingHolder
 */
export const getChildMatch = async (
  row: EnrollmentReportRow,
  organization: Organization,
  thingHolder: MapThingHolder
) => {
  const cacheMatch = getChildMatchFromCache(row, organization, thingHolder);
  if (cacheMatch) return cacheMatch;

  const dbMatch = await getChildMatchFromDB(row, organization, thingHolder);
  if (dbMatch) {
    const child = await getChildById(dbMatch.id, thingHolder.user);
    const childWithTags = { ...child, tags: [] };
    thingHolder.mappedChildren.push(childWithTags);
    return childWithTags;
  }
};

/**
 * Queries the database for a child record that matches the row on:
 * - firstname
 * - lastname
 * - birthdate
 * - sasid or unique id if it is present in the row
 * 	(note: this means you cannot update a record to include a new uniqueId via batch upload)
 * @param row
 * @param organization
 * @param thingHolder
 */
const getChildMatchFromDB = async (
  row: EnrollmentReportRow,
  organization: Organization,
  thingHolder: MapThingHolder
) => {
  const dbMatchQuery = thingHolder.transaction
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

  return dbMatchQuery.getOne();
};

/**
 * Looks in the mappedChildren cache for a record that matches the row on:
 * - firstname
 * - lastname
 * - birthdate
 * - sasid or unique id if it is present in the row
 * @param row
 * @param organization
 * @param thingHolder
 */
const getChildMatchFromCache = (
  row: EnrollmentReportRow,
  organization: Organization,
  thingHolder: MapThingHolder
) =>
  thingHolder.mappedChildren.find(
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
