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
import { propertyDateSorter } from '../../utils/propertyDateSorter';
import { getCurrentFunding } from '../../utils/getCurrentFunding';
import { getCurrentEnrollment } from '../../utils/getCurrentEnrollment';
import { ListChildReponse } from '../../../client/src/shared/payloads';

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const opts = await getFindOpts(user, { id });
  const child = await getManager().findOne(Child, opts);
  return await postProcessChild(child);
};

/**
 * Get all children the given user has access to.
 * Optionally, can filter to only return children:
 * 	- for specific organizations
 *  - with active enrollments in a specific month
 * 	- with missing info
 * Supports pagination with skip and take parameters, which
 * leverages offset fetch capability of sorted sql server query
 * (https://docs.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql?view=sql-server-ver15#syntax)
 */
export const getChildren = async (
  user: User,
  filterOpts: {
    organizationIds?: string[];
    missingInfoOnly?: boolean;  // When specified, only return children with missing information
    activeMonth?: Moment;       // When specified, only return children enrolled prior to or during this month
    skip?: number;
    take?: number;
  } = {}
): Promise<ListChildReponse> => {
  let {
    organizationIds,
    missingInfoOnly,
    activeMonth,
    skip,
    take,
  } = filterOpts;

  let children: Child[];
  let totalCount: number;

  const opts: FindManyOptions<Child> = await getFindOpts(user, {
    organizationIds,
    activeMonth
  });

  if (missingInfoOnly) {
    children = await getManager().find(Child, opts);

    children = (await Promise.all(children.map(postProcessChild)))
      .filter(child => child.validationErrors?.length);

    return {
      children: children.slice(skip, skip + take),
      totalCount: children.length
    };
  }

  [children, totalCount] = await getManager().findAndCount(Child, {
    ...opts,
    skip,
    take
  })

  children = (await Promise.all(children.map(postProcessChild)));

  return {
    children,
    totalCount
  };
};

/**
 * Get count of all children the given user has access to
 */
export const getCount = async (user: User) => {
  const opts = await getFindOpts(user);
  return getManager().count(Child, opts);
};

/**
 * Simple structs that hold minimum amount of information necessary
 * to partition the children across funding spaces in a nice formatted
 * display.
 */
type enrollmentTime = {
  timeType: string;
  filled: number;
  capacity: number;
};
type enrolledAgeGroup = {
  ageGroup: string;
  includedTimes: enrollmentTime[];
};

/**
 * Function that accumulates the distribution of how all children in
 * an organization are assigned to their various funding spaces
 * across age groups and enrollment times. Handles partitioning for
 * displaying so that the front end just has to spit this back out.
 * @param children
 */
export const getFundingSpaceMap = async (children: Child[]) => {
  // Structure to hold accumulated display information about each funding space
  const fundingSpacesDisplay: {
    sourceName: string;
    includedAgeGroups: enrolledAgeGroup[];
  }[] = [];

  children.forEach((child) => {
    const fundingSpace = getCurrentFunding({ child: child })?.fundingSpace;

    if (fundingSpace) {
      // Start with overall funding source, since it's the header
      const source = fundingSpace.source;
      let matchingSource = fundingSpacesDisplay.find(
        (fsd) => fsd.sourceName === source
      );
      if (matchingSource === undefined) {
        matchingSource = { sourceName: source, includedAgeGroups: [] };
        fundingSpacesDisplay.push(matchingSource);
      }

      // Then the age group, since a source is made up of a list of these
      const ageGroup = fundingSpace.ageGroup;
      let matchingGroup = matchingSource.includedAgeGroups.find(
        (ag) => ag.ageGroup === ageGroup
      );
      if (matchingGroup === undefined) {
        matchingGroup = { ageGroup, includedTimes: [] };
        matchingSource.includedAgeGroups.push(matchingGroup);
      }

      // Then go to the times within each age group, because that's the
      // last sub-list
      const timeType = fundingSpace.time;
      let matchingTime = matchingGroup.includedTimes.find(
        (t) => t.timeType === timeType
      );
      if (matchingTime === undefined) {
        matchingTime = {
          timeType,
          filled: 0,
          capacity: fundingSpace.capacity,
        };
        matchingGroup.includedTimes.push(matchingTime);
      }
      matchingTime.filled += 1;
    }
  });

  return fundingSpacesDisplay;
};

/**
 * Function that determines the distribution of children across sites.
 * Counts the children at each site and stores the result in a data
 * structure that pairs this count with id properties of the site
 * so that the front-end can send useres directly to a particular
 * site roster.
 * @param children
 */
export const getSiteCountMap = async (children: Child[]) => {
  const siteCounts: {
    siteName: string;
    count: number;
    orgId: number;
    siteId: number;
  }[] = [];

  children.forEach((c) => {
    const enrollment = getCurrentEnrollment(c);
    if (enrollment) {
      let match = siteCounts.find(
        (sc) => sc.siteName === enrollment?.site?.siteName
      );
      if (match === undefined) {
        match = {
          siteName: enrollment.site.siteName,
          count: 0,
          orgId: enrollment.site.organizationId,
          siteId: enrollment.site.id,
        };
        siteCounts.push(match);
      }
      match.count += 1;
    }
  });

  return siteCounts.sort((a, b) => (a.siteName > b.siteName ? 1 : -1));
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
  } = {}
): Promise<FindManyOptions<Child> | FindOneOptions<Child>> => {
  const { id, organizationIds } = filterOpts;
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
        qb.andWhere(
          '(Child__enrollments.siteId IN (:...siteIds) OR (Child__enrollments.siteId IS NULL AND (Child.authorId = :userId OR Child__enrollments.authorId = :userId)))',
          {
            siteIds: user.siteIds,
            userId: user.id,
          }
        );
      }

      if (filterOpts.activeMonth) {
        qb.andWhere('(Child__enrollment.entry <= :entry)',
          { 
            entry: filterOpts.activeMonth.endOf('month').format("YYYY-MM-DD") 
          }
        );
      }
    },
    loadEagerRelations: true,
  };

  return opts;
};

/**
 * Apply all post-processing to a child record:
 * 	- remove deleted entities
 * 	- sort entities by date
 * 	- validate full object tree
 * @param child
 */
const postProcessChild = async (child: Child) => {
  removeDeletedEntitiesFromChild(child);
  sortEntities(child);
  return validateObject(child);
};

/**
 * Sort enrollments, fundings, and income determinations
 * @param child
 */
const sortEntities = (child: Child) => {
  if (!child) return;
  if (child.enrollments) {
    child.enrollments = child.enrollments.sort((enrollmentA, enrollmentB) => {
      if (enrollmentA.fundings) {
        enrollmentA.fundings = enrollmentA.fundings.sort((fundingA, fundingB) =>
          propertyDateSorter(
            fundingA,
            fundingB,
            (f) => f.firstReportingPeriod.period
          )
        );
      }

      return propertyDateSorter(enrollmentA, enrollmentB, (e) => e.entry);
    });
  }

  if (child.family?.incomeDeterminations) {
    child.family.incomeDeterminations = child.family.incomeDeterminations.sort(
      (determinationA, determinationB) =>
        propertyDateSorter(
          determinationA,
          determinationB,
          (d) => d.determinationDate
        )
    );
  }
};
