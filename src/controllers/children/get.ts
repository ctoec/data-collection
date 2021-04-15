import { getManager } from 'typeorm';
import { User, Enrollment, FundingSpace, Child } from '../../entity';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import moment, { Moment } from 'moment';
import { getCurrentEnrollment } from '../../utils/getCurrentEnrollment';
import { validateObject } from '../../utils/processChild';
import { groupBy } from 'underscore';
import { getCurrentFunding } from '../../utils/getCurrentFunding';
import { NestedFundingSpaces } from '../../../client/src/shared/payloads/NestedFundingSpaces';
import { getFundingSpaces } from '../../controllers/fundingSpaces';
import { intersection } from 'lodash';

type skipTake = {
  skip?: number;
  take?: number;
};

const whereNotDeleted = (field: string) => `${field}.deletedDate IS NULL`;

/**
 * Get base query for getting children for given user. Applies organizationId filter to
 * all organizations the user has read-access for.
 * If user has site-level access, also applies a site filter to only return children
 * and enrollments for those sites. It also sorts enrollment and financial information.
 */
const queryBuilderBuilder = async ({
  user,
  organizationIds,
}: {
  user: User;
  organizationIds?: string[];
}) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const orgIds = organizationIds?.length
    ? intersection(readOrgIds, organizationIds)
    : readOrgIds;

  const qb = await getManager()
    .createQueryBuilder(Child, 'Child')
    // Restrict via org access
    .where('Child.organizationId IN (:...orgIds)', {
      // SQLServer doesn't like queries like "IN ()", so supply
      // an impossible value for empty arrays
      orgIds: orgIds.length ? orgIds : ['NULL'],
    })
    .leftJoinAndSelect('Child.organization', 'organization')
    // Add family (with income)
    .leftJoinAndSelect('Child.family', 'family')
    .leftJoinAndSelect(
      'family.incomeDeterminations',
      'family_incomeDetermination',
      whereNotDeleted('family_incomeDetermination')
    );

  // Enrollments with fundings
  qb.leftJoinAndSelect(
    'Child.enrollments',
    'enrollment',
    whereNotDeleted('enrollment')
  )
    .leftJoinAndSelect('enrollment.site', 'enrollment_site')
    .leftJoinAndSelect(
      'enrollment_site.organization',
      'enrollment_site_organization'
    )
    .leftJoinAndSelect(
      'enrollment.fundings',
      'enrollment_funding',
      whereNotDeleted('enrollment_funding')
    )
    .leftJoinAndSelect(
      'enrollment_funding.fundingSpace',
      'funding_fundingSpace'
    )
    .leftJoinAndSelect(
      'enrollment_funding.firstReportingPeriod',
      'funding_firstReportingPeriod'
    )
    .leftJoinAndSelect(
      'enrollment_funding.lastReportingPeriod',
      'funding_lastReportingPeriod'
    );

  // Restrict via site access
  if (user.accessType === 'site') {
    qb.andWhere(
      '(enrollment.siteId IN (:...siteIds) OR (enrollment.siteId IS NULL AND (Child.authorId = :userId OR enrollment.authorId = :userId)))',
      {
        siteIds: user.siteIds,
        userId: user.id,
      }
    );
  }

  // Sort enrollments (and funding) and income determinations
  qb.orderBy({
    'family_incomeDetermination.determinationDate': 'DESC',
    'enrollment.entry': 'DESC',
    'enrollment_funding.firstReportingPeriod': 'DESC',
  });

  return qb;
};

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const qb = await queryBuilderBuilder({ user });
  qb.andWhere('Child.id = :id', { id });

  const child = await qb.getOne();
  return await validateObject(child);
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
const activeChildrenQuery = async (
  user: User,
  organizationIds: string[],
  selectParams: {
    end: string;
    start: string;
  } & skipTake
) => {
  const { end, start, skip, take } = selectParams;
  const qb = await queryBuilderBuilder({ user, organizationIds });
  // Filter children: either with no enrollment or overlapping with time range
  qb.andWhere(
    '(enrollment.entry <= :end OR enrollment.entry IS NULL) AND (enrollment.exit >= :start OR enrollment.exit IS NULL)',
    {
      start,
      end,
    }
  );

  if (skip) qb.skip(skip);
  if (take) qb.take(take);

  return qb;
};

export const getActiveChildren = async (
  user: User,
  organizationIds?: string[],
  selectParams?: {
    month?: Moment;
  } & skipTake
) => {
  const { month = moment(), ...restParams } = selectParams;
  const qb = await activeChildrenQuery(user, organizationIds, {
    end: month.endOf('month').format('YYYY-MM-DD'),
    start: month.startOf('month').format('YYYY-MM-DD'),
    ...restParams,
  });
  const children = await qb.getMany();
  return await Promise.all(children.map(validateObject));
};

/**
 * Get count of active children
 */
export const getActiveChildrenCount = async (user: User, organizationIds) => {
  const month = moment();
  const qb = await activeChildrenQuery(user, organizationIds, {
    end: month.endOf('month').format('YYYY-MM-DD'),
    start: month.startOf('month').format('YYYY-MM-DD'),
  });

  return await qb.getCount();
};

export const getWithdrawnChildren = async (
  user: User,
  organizationIds?: string[],
  selectParams?: skipTake
) => {
  const { skip, take } = selectParams;

  const qb = await queryBuilderBuilder({ user, organizationIds });
  // Empty enrollments qualify as "active"
  qb.andWhere('enrollment.entry IS NOT NULL');
  // Subquery: find active enrollments by childId
  qb.andWhere((qb) => {
    const subQuery = qb
      .subQuery()
      .select('e.childId')
      .from(Enrollment, 'e')
      .where('e.exit IS NULL');

    // Inverse: Child not included as those with active enrollments
    return 'NOT Child.id IN ' + subQuery.getQuery();
  });

  if (skip) qb.skip(skip);
  if (take) qb.take(take);

  const children = await qb.getMany();
  return await Promise.all(children.map(validateObject));
};

export const getMissingInfoChildren = async (
  user: User,
  organizationIds: string[]
) => {
  const qb = await queryBuilderBuilder({ user, organizationIds });
  const preProcessedChildren = await qb.getMany();
  const children = await Promise.all(preProcessedChildren.map(validateObject));

  return children.filter((child) => child?.validationErrors?.length);
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
  const qb = await queryBuilderBuilder({ user, organizationIds });
  const children = await qb.getMany();

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
  const qb = await queryBuilderBuilder({ user, organizationIds });
  const children = await qb.getMany();

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
  const children = await getMissingInfoChildren(user, organizationIds);
  return children.reduce(
    (counts, child) => {
      if (
        !child.enrollments?.length ||
        child.enrollments?.some((enrollment) => !enrollment.exit)
      ) {
        counts.activeErrorsCount += 1;
      } else {
        counts.withdrawnErrorsCount += 1;
      }
      return counts;
    },
    { activeErrorsCount: 0, withdrawnErrorsCount: 0 }
  );
};

export const getMetadata = async (
  user: User,
  organizationIds: string[],
  showFundings?: boolean
) => {
  const count = await getActiveChildrenCount(user, organizationIds);
  const siteCountMap = await getSiteCountMap(user, organizationIds);
  const fundingSpacesMap = showFundings
    ? await getFundingSpaceMap(user, organizationIds)
    : null;

  return { count, fundingSpacesMap, siteCountMap };
};
