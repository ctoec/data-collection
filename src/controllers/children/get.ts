import { getManager } from 'typeorm';
import { User, FundingSpace, Child } from '../../entity';
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';
import { validateChild } from '../../utils/validateChild';
import { groupBy } from 'underscore';
import { getCurrentFunding } from '../../utils/getCurrentFunding';
import { NestedFundingSpaces } from '../../../client/src/shared/payloads/NestedFundingSpaces';
import { getFundingSpaces } from '../../controllers/fundingSpaces';
import { intersection } from 'lodash';
import { AgeGroup } from '../../../client/src/shared/models';
import { AgeGroupCount } from '../../../client/src/shared/payloads/AgeGroupCount';

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
  return await validateChild(child);
};

/**
 * Get children for a user
 */
const getChildrenQuery = async (user: User) => {
  const qb = await queryBuilderBuilder({ user });
  return qb;
};

export const getChildren = async (user: User) => {
  const qb = await getChildrenQuery(user);
  const children = await qb.getMany();
  return await Promise.all(children.map(validateChild));
};

/**
 * Counts the number of children in each age group enrolled at sites
 * associated with all of a user's organizations. No records are
 * returned, only the counts within each age group.
 */
export const getChildrenCountByAgeGroup = async (
  user: User
): Promise<AgeGroupCount> => {
  let ageGroupCounts = {} as AgeGroupCount;
  await Promise.all(
    Object.keys(AgeGroup).map(async (group) => {
      const qb = await getChildrenQuery(user);
      qb.andWhere('enrollment.ageGroup = :group', { group });
      ageGroupCounts[AgeGroup[group]] = await qb.getCount();
    })
  );
  return ageGroupCounts;
};

export const getMissingInfoChildren = async (
  user: User,
  organizationIds: string[]
) => {
  const qb = await queryBuilderBuilder({ user, organizationIds });
  const preProcessedChildren = await qb.getMany();
  const children = await Promise.all(preProcessedChildren.map(validateChild));

  return children.filter((child) => child?.validationErrors?.length);
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
