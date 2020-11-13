import { removeDeletedEntitiesFromChild } from '../../utils/filterSoftRemoved';
import {
  getManager,
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { User, Child } from '../../entity';
import { validateObject } from '../../utils/validateObject';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { Moment } from 'moment';

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const opts = await getFindOpts(user, { id });
  let child = await getManager().findOne(Child, opts);
  child = removeDeletedEntitiesFromChild(child);

  return await validateObject(child);
};

/**
 * Get all children the given user has access to.
 * Optionally, can filter to only return children:
 * 	- for specific organizations,
 * 	- with missing info
 * Supports pagination with skip and take parameters, which
 * leverages offset fetch capability of sorted sql server query
 * (https://docs.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql?view=sql-server-ver15#syntax)
 */
export const getChildren = async (
  user: User,
  filterOpts: {
    organizationIds?: string[];
    missingInfoOnly?: boolean;
    withdrawnOnly?: boolean;
    activeMonth?: Moment;
    skip?: number;
    take?: number;
  } = {}
) => {
  let {
    organizationIds,
    missingInfoOnly,
    withdrawnOnly,
    activeMonth,
    skip,
    take,
  } = filterOpts;

  const opts = (await getFindOpts(user, {
    organizationIds,
    withdrawnOnly,
  })) as FindManyOptions<Child>;
  opts.skip = skip;
  opts.take = take;

  let children = await getManager().find(Child, opts);
  children = children.map((c) => removeDeletedEntitiesFromChild(c));
  children = await Promise.all(children.map(validateObject));

  // If withdrawn qs param
  if (withdrawnOnly) {
    // Do not return any children with active enrollments
    children = children.filter((c) => c.enrollments?.every((e) => !!e.exit));
  }
  // Else if month qs param
  else if (activeMonth) {
    // Do not return children withouth active enrollment during or before that month
    children = children.filter((c) => {
      // filter out enrollments after the current month filter
      c.enrollments = c.enrollments?.filter((e) =>
        e.entry.isSameOrBefore(activeMonth.endOf('month'))
      );

      // filter out children with no qualifying enrollments
      return c.enrollments && c.enrollments.length;
    });
  }
  // Else
  else {
    // Default is to return all children with any active enrollments
    children = children.filter((c) => c.enrollments?.some((e) => !e.exit));
  }

  // If missing info qs param
  if (missingInfoOnly) {
    // Only return children with missing info
    children = children.filter(
      (child) => child.validationErrors && child.validationErrors.length
    );
  }

  return children;
};

/**
 * Get count of all children the given user has access to
 */
export const getCount = async (user: User) => {
  const opts = await getFindOpts(user);
  return getManager().count(Child, opts);
};

/**
 * Get base query for getting children for given user. Applies organizationId filter,
 * either as supplied by user or all organizations the user has read-access for.
 * If user has site-level access, also applies a site filter to only return children
 * and enrollments for those sites
 * @param user
 * @param organizationIds
 */
const getFindOpts = async (
  user: User,
  filterOpts: {
    id?: string;
    organizationIds?: string[];
    activeMonth?: Moment;
    withdrawnOnly?: boolean;
  } = {}
) => {
  const { id, organizationIds, activeMonth, withdrawnOnly } = filterOpts;
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const filterOrgIds =
    organizationIds?.filter((orgId) => readOrgIds.includes(orgId)) ||
    readOrgIds;

  const opts: FindManyOptions<Child> | FindOneOptions<Child> = {
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.site',
      'enrollments.site.organization',
      'enrollments.fundings',
      'organization',
    ],
    where: (qb: SelectQueryBuilder<Child>) => {
      qb.where('Child.organizationId IN (:...orgIds)', {
        // SQLServer doesn't like queries like "IN ()", so supply
        // an impossible value for empty arrays
        orgIds: filterOrgIds.length ? filterOrgIds : ['NULL'],
      });

      if (id) {
        qb.andWhere('Child.id = :id', { id });
      }

      // On deck for typeORM to implement where for nested relations in find
      // https://github.com/typeorm/typeorm/issues/2707
      // Until then, use the generated aliases to do nested filtering
      if (user.accessType === 'site') {
        qb.andWhere('Child__enrollments.siteId IN (:...siteIds)', {
          siteIds: user.siteIds,
        });
      }
    },
    loadEagerRelations: true,
  };

  return opts;
};
