import { getManager } from 'typeorm';
import { ExitReason } from '../../client/src/shared/models';
import { Child, ReportingPeriod, Enrollment, Funding } from '../entity';
import { ChangeEnrollment } from '../../client/src/shared/payloads';
import { BadRequestError } from '../middleware/error/errors';

export const getChildById = (id: string) => {
  return getManager().findOne(Child, {
    where: { id },
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.fundings',
    ],
  });
};

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
        const newEnrollmentNextReportingPeriod =
          changeEnrollmentData.newEnrollment.funding?.firstReportingPeriod;

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

        currentFunding.lastReportingPeriod = lastReportingPeriod;
        await tManager.save(currentFunding);
      }

      currentEnrollment.exitReason =
        currentEnrollment.ageGroup !==
        changeEnrollmentData.newEnrollment.ageGroup
          ? ExitReason.AgedOut
          : ExitReason.MovedWithinProgram;

      const oldEnrollmentExit = changeEnrollmentData.oldEnrollment?.exitDate;
      const newEnrollmentStart = changeEnrollmentData.newEnrollment.startDate;
      currentEnrollment.exit =
        oldEnrollmentExit || newEnrollmentStart.add(-1, 'day');

      await tManager.save(currentEnrollment);
    }

    // Create new enrollment
    const enrollment = tManager.create(Enrollment, {
      ageGroup: changeEnrollmentData.newEnrollment.ageGroup,
      site: changeEnrollmentData.newEnrollment.site,
      entry: changeEnrollmentData.newEnrollment.startDate,
      child,
    });
    await tManager.save(enrollment);

    // Create new funding, if exists
    if (changeEnrollmentData.newEnrollment.funding) {
      const funding = tManager.create(Funding, {
        enrollment,
        fundingSpace: changeEnrollmentData.newEnrollment.funding.fundingSpace,
        firstReportingPeriod:
          changeEnrollmentData.newEnrollment.funding.firstReportingPeriod,
      });
      await tManager.save(funding);
    }
  });
};
