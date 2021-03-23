import {
  getManager,
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { User, FundingSpace, Child } from '../../entity';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import moment, { Moment } from 'moment';
import { getCurrentEnrollment } from '../../utils/getCurrentEnrollment';
import { postProcessChild } from '../../utils/processChild';
import { groupBy } from 'underscore';
import { getCurrentFunding } from '../../utils/getCurrentFunding';
import { NestedFundingSpaces } from '../../../client/src/shared/payloads/NestedFundingSpaces';
import { getFundingSpaces } from '../../controllers/fundingSpaces';
import { intersection } from 'lodash';

/**
 * Get base query for getting children for given user. Applies organizationId filter,
 * all organizations the user has read-access for.
 * If user has site-level access, also applies a site filter to only return children
 * and enrollments for those sites
 * Accepts QueryBuilder extension function to manipulate the SELECT query.
 */
const findChildrenOpts = async ({
  user,
  organizationIds,
  extendQB,
}: {
  user: User;
  organizationIds?: string[];
  extendQB?: (qb: SelectQueryBuilder<Child>) => void;
}) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const orgIds = organizationIds?.length
    ? intersection(readOrgIds, organizationIds)
    : readOrgIds;

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
        orgIds: orgIds.length ? orgIds : ['NULL'],
      });
      // On deck for typeORM to implement where for nested relations in find
      // https://github.com/typeorm/typeorm/issues/2707
      // Until then, use the generated aliases to do nested filtering
      if (user.accessType === 'site') {
        qb.andWhere(
          '(Child__enrollments.siteId IN (:...siteIds) OR (Child__enrollments.siteId IS NULL AND (Child.authorId = :userId OR Child__enrollments.authorId = :userId)))',
          {
            siteIds: user.siteIds,
            userId: user.id,
          }
        );
      }

      if (extendQB) extendQB(qb);
    },
    loadEagerRelations: true,
  };

  return opts;
};

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const opts = await findChildrenOpts({
    user,
    extendQB: (qb) => qb.andWhere('Child.id = :id', { id }),
  });

  const child = await getManager().findOne(Child, opts);
  return await postProcessChild(child);
};

/**
 * Get all active children for the current month that the given user has access.
 * Optionally, can filter to only return children:
 * 	- for specific organizations
 *  - with active enrollments for a different time frame
 * Supports pagination with skip and take parameters, which
 * leverages offset fetch capability of sorted sql server query
 * (https://docs.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql?view=sql-server-ver15#syntax)
 */
export const getActiveChildren = async (
  user: User,
  organizationIds?: string[],
  selectParms?: {
    activeMonth?: Moment;
    skip?: number;
    take?: number;
  }
) => {
  const {
    activeMonth = moment(), // Default to the current month
    skip,
    take,
  } = selectParms;
  const opts = await findChildrenOpts({
    user,
    organizationIds,
    extendQB: (qb) => {
      // Filter children with enrollments in the active month
      const start = activeMonth.startOf('month').format('YYYY-MM-DD');
      const end = activeMonth.endOf('month').format('YYYY-MM-DD');

      // TODO filter and only return matching enrollments
      qb.andWhere(
        '(Child__enrollments.entry <= :start) AND (Child__enrollments.exit <= :end OR Child__enrollments.exit IS NULL)',
        {
          start,
          end,
        }
      );
    },
  });

  const preProcessedChildren = await getManager().find(Child, {
    ...opts,
    skip,
    take,
  });
  const children = await Promise.all(
    preProcessedChildren.map(postProcessChild)
  );

  return children;
};

export const getWithdrawnChildren = async (
  user: User,
  organizationIds?: string[],
  selectParms?: {
    skip?: number;
    take?: number;
  }
) => {
  const { skip, take } = selectParms;
  const opts = await findChildrenOpts({
    user,
    organizationIds,
    extendQB: (qb) => {
      // TODO: search properly: children with no null `exits` in any enrollments
      qb.andWhere('Child__enrollments.exit IS NULL');
    },
  });

  const preProcessedChildren = await getManager().find(Child, {
    ...opts,
    skip,
    take,
  });
  const children = await Promise.all(
    preProcessedChildren.map(postProcessChild)
  );
  return children;
};

export const getMissingInfoChildren = async (
  user: User,
  organizationIds: string[]
) => {
  const opts = await findChildrenOpts({ user, organizationIds });
  const preProcessedChildren = await getManager().find(Child, opts);
  const children = await Promise.all(
    preProcessedChildren.map(postProcessChild)
  );

  return children.filter((child) => child?.validationErrors?.length);
};

/**
 * Get count of all children the given user has access to
 */
export const getCount = async (user: User, organizationIds) => {
  const opts = await findChildrenOpts({ user, organizationIds });
  return getManager().count(Child, opts);
};

/**
 * Function that determines the distribution of children across sites.
 * Counts the children at each site and stores the result in a data
 * structure that pairs this count with id properties of the site
 * so that the front-end can send useres directly to a particular
 * site roster.
 */
export const getSiteCountMap = async (
  user: User,
  organizationIds: string[]
) => {
  const siteCounts: {
    siteName: string;
    count: number;
    orgId: number;
    siteId: number;
  }[] = [];
  const opts = await findChildrenOpts({ user, organizationIds });
  const children = await getManager().find(Child, opts);

  children.forEach((c) => {
    const enrollment = getCurrentEnrollment(c);
    if (enrollment) {
      if (
        user.accessType == 'organization' ||
        user.siteIds.includes(enrollment.site.id)
      ) {
        let match = siteCounts.find(
          (sc) => sc.siteName === enrollment?.site?.siteName
        );
        if (match === undefined) {
          match = {
            siteName: enrollment?.site?.siteName,
            count: 0,
            orgId: enrollment?.site?.organizationId,
            siteId: enrollment?.site?.id,
          };
          siteCounts.push(match);
        }
        match.count += 1;
      }
    }
  });

  return siteCounts.sort((a, b) => (a.siteName > b.siteName ? 1 : -1));
};

/**
 * Function that accumulates the distribution of how all children in
 * an organization are assigned to their various funding spaces
 * across age groups and enrollment times. Handles partitioning for
 * displaying so that the front end just has to spit this back out.
 */
export const getFundingSpaceMap = async (
  user: User,
  organizationIds: string[]
): Promise<NestedFundingSpaces> => {
  const opts = await findChildrenOpts({
    user,
    organizationIds,
    extendQB: (qb) => {
      if (organizationIds?.length) {
        qb.andWhere('Child.organizationId IN (:...organizationIds)', {
          organizationIds,
        });
      }
    },
  });
  const children = await getManager().find(Child, opts);

  const fundingSpaces = await getFundingSpaces(user, organizationIds);
  const fundingSpacesDisplay = {} as NestedFundingSpaces;

  const fundingSpacesWithChildCount = fundingSpaces.map((fs) => {
    const filledSeats = children.filter((child) => {
      const currentFunding = getCurrentFunding({ child: child });
      return currentFunding?.fundingSpace?.id === fs.id;
    }).length;
    return { ...fs, filled: filledSeats };
  });

  const spacesBySource = groupBy(
    fundingSpacesWithChildCount,
    (fs: FundingSpace) => fs.source
  );

  for (const source in spacesBySource) {
    fundingSpacesDisplay[source] = groupBy(
      spacesBySource[source],
      (fs: FundingSpace) => fs.ageGroup
    );
  }

  return fundingSpacesDisplay;
};

export const getErrorCounts = async (user: User, organizationIds: string[]) => {
  const opts = await findChildrenOpts({ user, organizationIds });
  const preProcessedChildren = await getManager().find(Child, opts);
  const children = await Promise.all(
    preProcessedChildren.map(postProcessChild)
  );
  const { active, withdrawn } = children
    .filter((child) => child.validationErrors?.length)
    .reduce(
      (filteredChildren, child) => {
        if (
          child.enrollments?.length &&
          child.enrollments?.every((enrollment) => !!enrollment.exit)
        ) {
          filteredChildren.withdrawn.push(child);
        } else {
          filteredChildren.active.push(child);
        }
        return filteredChildren;
      },
      { active: [] as Child[], withdrawn: [] as Child[] }
    );

  return {
    activeErrorsCount: active.length,
    withdrawnErrorsCount: withdrawn.length,
  };
};

export const getMetadata = async (
  user: User,
  organizationIds: string[],
  showFundings?: boolean
) => {
  const count = await getCount(user, organizationIds);
  const siteCountMap = await getSiteCountMap(user, organizationIds);
  const fundingSpacesMap = showFundings
    ? await getFundingSpaceMap(user, organizationIds)
    : null;

  return { count, fundingSpacesMap, siteCountMap };
};
