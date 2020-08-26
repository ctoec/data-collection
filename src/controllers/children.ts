import { getManager } from 'typeorm';
import idx from 'idx';
import { ExitReason } from '../../client/src/shared/models';
import { Child, ReportingPeriod, Enrollment, Funding } from '../entity';
import { ChangeEnrollment } from '../../client/src/shared/payloads';
import { BadRequestError } from '../middleware/error/errors';

/**
 * Get child by id, with related family and related
 * family income determinations, and enrollments and
 * related fundings
 * @param id
 */
export const getChildById = async (id: string) => {
  const child = await getManager().findOne(Child, {
    where: { id },
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.site',
      'enrollments.fundings',
    ],
  });

  // TODO update typeORM and sort related entities in DB
  if (child) {
    child.enrollments = child.enrollments.sort((a, b) => {
      if (!a.exit) return -1;
      if (!b.exit) return 1;
      if (a.exit < b.exit) return -1;
      if (b.exit < a.exit) return 1;
      return 0;
    });
  }

  return child;
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

  if (!child) return;

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
        const lastReportingPeriod =
          oldEnrollmentLastReportingPeriod ||
          (await tManager.findOne(ReportingPeriod, {
            where: {
              period: newEnrollmentNextReportingPeriod.period.add(-1, 'month'),
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
