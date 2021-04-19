import { getChildById } from '../../../children';
import { Organization, Child } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { Brackets } from 'typeorm';
import { MapThingHolder } from '../setUpMapThingHolder';

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
