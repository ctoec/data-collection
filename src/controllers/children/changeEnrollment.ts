import { getManager, EntityManager } from 'typeorm';
import idx from 'idx';
import { ChangeEnrollment } from '../../../client/src/shared/payloads';
import {
  ExitReason,
  Enrollment as EnrollmentInterface,
} from '../../../client/src/shared/models';
import { getChildById } from './get';
import { NotFoundError, BadRequestError } from '../../middleware/error/errors';
import {
  User,
  ReportingPeriod,
  Funding,
  Enrollment,
  Site,
  FundingSpace,
  Child,
} from '../../entity';

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
        await tManager.save(Funding, {
          ...currentFunding,
          updateMetaData: { author: user },
        });
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

      await tManager.save(Enrollment, {
        ...currentEnrollment,
        updateMetaData: { author: user },
      });
    }

    await createNewEnrollment(
      changeEnrollmentData.newEnrollment,
      child,
      tManager,
      user
    );
  });
};

async function createNewEnrollment(
  newEnrollment: EnrollmentInterface,
  child: Child,
  tManager: EntityManager,
  user: User
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
  await tManager.save(Enrollment, {
    ...enrollment,
    updateMetaData: { author: user },
  });

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
    await tManager.save(Funding, {
      ...funding,
      updateMetaData: { author: user },
    });
  }
}
