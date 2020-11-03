import { getManager, In } from 'typeorm';
import idx from 'idx';
import {
  ExitReason,
  Enrollment as EnrollmentInterface,
} from '../../client/src/shared/models';
import {
  Child,
  ReportingPeriod,
  Enrollment,
  Funding,
  User,
  Family,
  Site,
  FundingSpace,
} from '../entity';
import { ChangeEnrollment } from '../../client/src/shared/payloads';
import { BadRequestError, NotFoundError } from '../middleware/error/errors';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { propertyDateSorter } from '../utils/propertyDateSorter';
import { validateObject } from '../utils/distributeValidationErrorsToSubObjects';

const FULL_RECORD_RELATIONS = [
  'family',
  'family.incomeDeterminations',
  'enrollments',
  'enrollments.site',
  'enrollments.site.organization',
  'enrollments.fundings',
  'organization',
];

// Sort enrollments by exit date
const sortEnrollments = (child: Child) => {
  if (!child.enrollments) return;
  child.enrollments = child.enrollments.sort((enrollmentA, enrollmentB) => {
    if (enrollmentA.fundings) {
      // Sort fundings by last reporting period
      enrollmentA.fundings = enrollmentA.fundings.sort((fundingA, fundingB) =>
        propertyDateSorter(
          fundingA,
          fundingB,
          (f) => f.lastReportingPeriod?.period
        )
      );
    }

    return propertyDateSorter(enrollmentA, enrollmentB, (e) => e.exit);
  });
};

// Sort income determinations by date
const sortIncomeDeterminations = (child: Child) => {
  child.family.incomeDeterminations = child.family.incomeDeterminations.sort(
    (determinationA, determinationB) =>
      propertyDateSorter(
        determinationA,
        determinationB,
        (d) => d.determinationDate
      )
  );
};

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const child = await getManager().findOne(Child, id, {
    relations: FULL_RECORD_RELATIONS,
    where: { organizationId: In(readOrgIds) },
  });

  if (child) {
    sortEnrollments(child);
    if (child.family) {
      sortIncomeDeterminations(child);
    }
  }

  // If site-level user, filter out children not enrolled at allowed sites
  // TODO: should we filter out enrollments not at allowed sites?
  if (user.sitePermissions?.length) {
    if (
      !idx(child, (_) =>
        _.enrollments.some((e) => user.siteIds.includes(e.siteId))
      )
    ) {
      return undefined;
    }
  }

  return validateObject(child);
};

/**
 * Get all children. By default, returns all children for all orgs the user has access to.
 * Optional filter params:
 * - organizationIds - a list of organziationIds to pull children for
 * - missingInfo - a flag to filter out children without any validation errors
 */
export const getChildren = async (
  user: User,
  filterOpts: { organizationIds?: string[]; missingInfo?: string }
) => {
  let { organizationIds, missingInfo } = filterOpts;
  const readAccessibleOrgIds = await getReadAccessibleOrgIds(user);

  // Get children for all read-accessible orgs for user if no query values provided
  if (!organizationIds || !organizationIds.length) {
    organizationIds = readAccessibleOrgIds;
  }
  // Otherwise, use the provided values from query (but filter to only include orgIds the user has access to)
  else {
    organizationIds = organizationIds.filter((inputOrgId) =>
      readAccessibleOrgIds.includes(inputOrgId)
    );
  }

  let children = await getManager().find(Child, {
    relations: FULL_RECORD_RELATIONS,
    order: { id: 1 },
    where: {
      organizationId: In(organizationIds),
    },
  });

  // If site-level user, filter out children not enrolled at allowed sites
  // TODO: should we filter out enrollments not at allowed sites?
  if (user.sitePermissions?.length) {
    children = children.filter((c) =>
      idx(c, (_) => _.enrollments.some((e) => user.siteIds.includes(e.siteId)))
    );
  }

  // Apply validations to children that will be returned
  children.map(validateObject);

  // Filter for only children with errors if missingInfo = true
  if (missingInfo === 'true') {
    children = children.filter(
      (child) => child.validationErrors && child.validationErrors.length
    );
  }

  return children;
};

/**
 * Get count of children the user has access to
 */
export const getCount = async (user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  let children = await getManager().find(Child, {
    relations: ['enrollments'],
    where: {
      organizationId: In(readOrgIds),
    },
  });

  // If site level user, filter out children not enrolled at allowed sites
  // TODO: should we filter out enrollments not at allowed sites?
  if (user.sitePermissions?.length) {
    children = children.filter((c) =>
      idx(c, (_) => _.enrollments.some((e) => user.siteIds.includes(e.siteId)))
    );
  }

  return children.length;
};

/**
 * Update child record, if user has access
 * @param id
 * @param user
 * @param update
 */
export const updateChild = async (
  id: string,
  user: User,
  update: Partial<Child>
) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const child = await getManager().findOne(Child, id, {
    where: { organization: { id: In(readOrgIds) } },
  });

  if (!child) {
    console.warn(
      'Child either does not exist, or user does not have permission to modify'
    );
    throw new NotFoundError();
  }

  await getManager().save(getManager().merge(Child, child, update));
};

/**
 * Delete child record, if user has access
 * @param id
 * @param user
 */
export const deleteChild = async (id: string, user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  const child = await getManager().findOne(Child, id, {
    where: { organization: { id: In(readOrgIds) } },
  });

  if (!child) {
    console.warn(
      'Child either does not exist, or user does not have permission to modify'
    );
    throw new NotFoundError();
  }

  await getManager().delete(Child, { id });
};

/**
 * Creates a child from a POST request body.
 * Also, creates a family if one does not exist.
 * @param _child
 */
export const createChild = async (_child: Child, user: User) => {
  const readOrgIds = await getReadAccessibleOrgIds(user);
  if (
    !readOrgIds.length ||
    !_child.organization ||
    !readOrgIds.includes(`${_child.organization.id}`)
  ) {
    console.error(
      'User does not have permission to create the child row supplied'
    );
    throw new Error('Child creation request denied');
  }

  // TODO: make family optional on the child
  // (to enable family lookup when adding new child)
  // and stop creating it here
  if (!_child.family) {
    const organization = _child.organization;
    const family = await getManager().save(
      getManager().create(Family, { organization })
    );
    _child.family = family;
  }

  return getManager().save(getManager().create(Child, _child));
};

/**
 * Attempts to create a new enrollment, and optionally funding,
 * for the child with `id`.
 *
 * If previous enrollment and optionally funding exist, attempts to
 * 'end' them by updating with exit date and last reporting period.
 *
 * If any of these operations fail, the entire transaction is rolled
 * back and an error is thrown.
 * @param id
 * @param changeEnrollmentData
 */
export const changeEnrollment = async (
  id: string,
  changeEnrollmentData: ChangeEnrollment,
  user: User
) => {
  const child = await getChildById(id, user);

  if (!child) throw new NotFoundError();

  // Get current enrollment
  return getManager().transaction(async (tManager) => {
    // Update current enrollment, if exists
    const currentEnrollment = (child.enrollments || []).find((e) => !e.exit);
    if (currentEnrollment) {
      const currentFunding = (currentEnrollment.fundings || []).find(
        (f) => !f.lastReportingPeriod
      );
      // Update current funding, if exists
      if (currentFunding) {
        const oldEnrollmentLastReportingPeriod =
          changeEnrollmentData.oldEnrollment?.funding?.lastReportingPeriod;
        const newEnrollmentNextReportingPeriod = idx(
          changeEnrollmentData,
          (_) => _.newEnrollment.fundings[0].firstReportingPeriod
        );

        // Require some way to determine last reporting period for current funding
        if (
          !oldEnrollmentLastReportingPeriod &&
          !newEnrollmentNextReportingPeriod
        ) {
          throw new BadRequestError(
            'Last reporting period for current funding must be provided if no new funding is provided'
          );
        }

        // If the new funding first reporting period only has id
        // look up period from DB to enable later look ups based
        // on that value
        if (
          !oldEnrollmentLastReportingPeriod &&
          newEnrollmentNextReportingPeriod &&
          newEnrollmentNextReportingPeriod.id &&
          !newEnrollmentNextReportingPeriod.period
        ) {
          newEnrollmentNextReportingPeriod.period = (
            await tManager.findOne(
              ReportingPeriod,
              newEnrollmentNextReportingPeriod.id
            )
          ).period;
        }

        const lastReportingPeriod =
          oldEnrollmentLastReportingPeriod ||
          (await tManager.findOne(ReportingPeriod, {
            where: {
              period: newEnrollmentNextReportingPeriod.period
                .clone()
                .add(-1, 'month'),
              type: currentFunding.fundingSpace.source,
            },
          }));

        // Update current funding lastReportinPeriod
        currentFunding.lastReportingPeriod = lastReportingPeriod;
        await tManager.save(Funding, currentFunding);
      }

      // Update current enrollment exitReason
      currentEnrollment.exitReason =
        currentEnrollment.ageGroup !==
        changeEnrollmentData.newEnrollment.ageGroup
          ? ExitReason.AgedOut
          : ExitReason.MovedWithinProgram;

      // Update current enrollment exit date
      const oldEnrollmentExit = changeEnrollmentData.oldEnrollment?.exitDate;
      const newEnrollmentStart = changeEnrollmentData.newEnrollment.entry;
      currentEnrollment.exit =
        oldEnrollmentExit || newEnrollmentStart.clone().add(-1, 'day');

      await tManager.save(Enrollment, currentEnrollment);
    }

    await createNewEnrollment(
      changeEnrollmentData.newEnrollment,
      child,
      tManager
    );
  });
};

async function createNewEnrollment(
  newEnrollment: EnrollmentInterface,
  child: Child,
  tManager
): Promise<void> {
  if (newEnrollment.site) {
    const matchingSite = await tManager.findOne(Site, newEnrollment.site.id);

    if (!matchingSite || matchingSite.organizationId !== child.organizationId) {
      console.error(
        'User either provided an unknown site or a site this childs org does not have permission for'
      );
      throw new Error('Invalid site supplied for enrollment');
    }
  }

  const enrollment = tManager.create(Enrollment, {
    ...newEnrollment,
    child,
  });
  await tManager.save(Enrollment, enrollment);

  // Create new funding, if exists
  if (newEnrollment.fundings && newEnrollment.fundings.length) {
    const matchingFundingSpace: FundingSpace = await tManager.findOne(
      FundingSpace,
      newEnrollment.fundings[0].fundingSpace.id
    );

    if (
      !matchingFundingSpace ||
      matchingFundingSpace.organizationId !== child.organizationId
    ) {
      console.error(
        'User either provided an unknown funding space or a funding space this childs org does not have permission for'
      );
      throw new Error('Invalid funding space supplied for enrollment');
    }

    const funding = tManager.create(Funding, {
      enrollment,
      fundingSpace: idx(newEnrollment, (_) => _.fundings[0].fundingSpace),
      firstReportingPeriod: idx(
        newEnrollment,
        (_) => _.fundings[0].firstReportingPeriod
      ),
    });
    await tManager.save(Funding, funding);
  }
}
