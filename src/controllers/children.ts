import { getManager, In } from 'typeorm';
import idx from 'idx';
import { validate } from 'class-validator';
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
import { getReadAccessibileOrgIds } from '../utils/getReadAccessibleOrgIds';
import { distributeValidationErrorsToSubObjects } from '../utils/distributeValidationErrorsToSubObjects';
import { propertyDateSorter } from '../utils/propertyDateSorter';

/**
 * Get all children for organizations the user has access to
 */
export const getChildren = async (user: User) => {
  const readOrgIds = await getReadAccessibileOrgIds(user);
  return await getManager().find(Child, {
    relations: [
      'enrollments',
      'enrollments.site',
      'enrollments.site.organization',
      'enrollments.fundings',
    ],
    where: { organization: { id: In(readOrgIds) } },
  });
};

export const updateChild = async (
  id: string,
  user: User,
  update: Partial<Child>
) => {
  const readOrgIds = await getReadAccessibileOrgIds(user);
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

export const deleteChild = async (id: string, user: User) => {
  const readOrgIds = await getReadAccessibileOrgIds(user);
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
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string, user: User): Promise<Child> => {
  const readOrgIds = await getReadAccessibileOrgIds(user);
  const child = await getManager().findOne(Child, id, {
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.site',
      'enrollments.site.organization',
      'enrollments.fundings',
      'organization',
    ],
    where: { organization: { id: In(readOrgIds) } },
  });

  // Sort enrollments by exit date
  if (child) {
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
  }
  const validationErrors = await validate(child, {
    validationError: { target: false },
  });
  return distributeValidationErrorsToSubObjects(child, validationErrors);
};

/**
 * Creates a child from a POST request body.
 * Also, creates a family if one does not exist.
 * @param _child
 */
export const createChild = async (_child: Child, user: User) => {
  const readOrgIds = await getReadAccessibileOrgIds(user);
  if (
    !readOrgIds.length ||
    !_child.organization ||
    !readOrgIds.includes(_child.organization.id)
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
    ageGroup: newEnrollment.ageGroup,
    site: newEnrollment.site,
    entry: newEnrollment.entry,
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
