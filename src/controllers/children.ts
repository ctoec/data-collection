import { getManager } from 'typeorm';
import idx from 'idx';
import { ExitReason } from '../../client/src/shared/models';
import { Child, ReportingPeriod, Enrollment, Funding } from '../entity';
import { ChangeEnrollment } from '../../client/src/shared/payloads';
import { BadRequestError, NotFoundError } from '../middleware/error/errors';
import { Moment } from 'moment';

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string) => {
  const child = await getManager().findOne(Child, id, {
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.site',
      'enrollments.site.organization',
      'enrollments.fundings',
    ],
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
  return child;
};

const propertyDateSorter = <T>(
  a: T,
  b: T,
  accessor: (_: T) => Moment | null | undefined
) => {
  const aDate = accessor(a);
  const bDate = accessor(b);

  if (!aDate) return 1;
  if (!bDate) return -1;
  if (aDate < bDate) return 1;
  if (bDate < aDate) return -1;
  return 0;
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
  changeEnrollmentData: ChangeEnrollment
) => {
  const child = await getChildById(id);

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
              period: newEnrollmentNextReportingPeriod.period.add(-1, 'month'),
              type: currentFunding.fundingSpace.source,
            },
          }));

        // Update current funding lastReportinPeriod
        currentFunding.lastReportingPeriod = lastReportingPeriod;
        await tManager.save(currentFunding);
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
        oldEnrollmentExit || newEnrollmentStart.add(-1, 'day');

      await tManager.save(currentEnrollment);
    }

    // Create new enrollment
    const enrollment = tManager.create(Enrollment, {
      ageGroup: changeEnrollmentData.newEnrollment.ageGroup,
      site: changeEnrollmentData.newEnrollment.site,
      entry: changeEnrollmentData.newEnrollment.entry,
      child,
    });
    await tManager.save(enrollment);

    // Create new funding, if exists
    if (changeEnrollmentData.newEnrollment.fundings) {
      const funding = tManager.create(Funding, {
        enrollment,
        fundingSpace: idx(
          changeEnrollmentData,
          (_) => _.newEnrollment.fundings[0].fundingSpace
        ),
        firstReportingPeriod: idx(
          changeEnrollmentData,
          (_) => _.newEnrollment.fundings[0].firstReportingPeriod
        ),
      });
      await tManager.save(funding);
    }
  });
};
