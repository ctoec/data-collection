import {
  getManager,
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { User, Child } from '../../entity';
import { validateObject } from '../../utils/distributeValidationErrorsToSubObjects';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const opts = await getFindOpts(user);
  const child = await getManager().findOne(Child, opts);

  return validateObject(child);
};

/**
 * Get all children the given user has access to.
 * Optionally, can filter to only return children:
 * 	- for specific organizations,
 * 	- with missing info
 * Supports pagination with skip and take parameters
 */
export const getChildren = async (
  user: User,
  filterOpts: {
    organizationIds?: string[];
    missingInfo?: string;
    skip?: number;
    take?: number;
  }
) => {
  let { organizationIds, missingInfo, skip, take } = filterOpts;

  const opts = (await getFindOpts(user, organizationIds)) as FindManyOptions<
    Child
  >;
  opts.skip = skip;
  opts.take = take;

  let children = await getManager().find(Child, opts);

  children.map(validateObject);

  if (missingInfo === 'true') {
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
const getFindOpts = async (user: User, organizationIds?: string[]) => {
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
        orgIds: filterOrgIds,
      });
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
