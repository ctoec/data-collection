import { removeDeletedElements } from '../utils/processChild';
import { getManager, In, IsNull } from 'typeorm';
import {
  ChangeFundingRequest,
  WithdrawRequest,
} from '../../client/src/shared/payloads';
import { Enrollment, ReportingPeriod, Funding, User } from '../entity';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';

export const getEnrollment = async (
  id: number | string,
  user: User,
  withFundings?: boolean
) => {
  const enrollment = await getManager().findOne(Enrollment, {
    where: [
      { siteId: In(user.siteIds), id },
      { siteId: IsNull(), id },
    ],
    relations: withFundings ? ['fundings'] : undefined,
  });

  if (!enrollment) throw new NotFoundError();
  return enrollment;
};

export const getFunding = async (
  enrollmentId: number | string,
  fundingId: number | string,
  user: User
) => {
  // To assert that the user has access to the enrollment
  await getEnrollment(enrollmentId, user);
  const funding = await getManager().findOne(Funding, fundingId, {
    where: { enrollmentId },
  });

  if (!funding) throw new NotFoundError();

  return funding;
};

export const changeFunding = async (
  id: number,
  user: User,
  changeFundingData: ChangeFundingRequest
) => {
  const enrollment = await getEnrollment(id, user, true);
  enrollment.fundings = removeDeletedElements(enrollment.fundings);

  return getManager().transaction(async (tManager) => {
    // Update current funding, if exists
    const currentFunding = (enrollment.fundings || []).find(
      (f) => !f.lastReportingPeriod
    );

    if (currentFunding) {
      const oldFundingLastReportingPeriod =
        changeFundingData.oldFunding?.lastReportingPeriod;
      const newFundingFirstReportingPeriod =
        changeFundingData.newFunding?.firstReportingPeriod;

      // Require some way to determine last reporting period for current funding
      if (!oldFundingLastReportingPeriod && !newFundingFirstReportingPeriod) {
        throw new BadRequestError(
          'Last reporting period for current funding must be provided if no new funding is provided'
        );
      }

      // If the new funding first reporting period only has id
      // look up period from DB to enable later look ups based
      // on that value
      if (
        !oldFundingLastReportingPeriod &&
        newFundingFirstReportingPeriod?.id &&
        !newFundingFirstReportingPeriod?.period
      ) {
        newFundingFirstReportingPeriod.period = (
          await tManager.findOne(
            ReportingPeriod,
            newFundingFirstReportingPeriod.id
          )
        ).period;
      }

      let periodBeforeNewFundingFirst = newFundingFirstReportingPeriod?.period
        .clone()
        .add(-1, 'month');

      const lastReportingPeriod =
        oldFundingLastReportingPeriod ||
        (await tManager.findOne(ReportingPeriod, {
          where: {
            period: periodBeforeNewFundingFirst,
            type: currentFunding.fundingSpace.source,
          },
        }));

      // Update current funding last reporting period
      currentFunding.lastReportingPeriod = lastReportingPeriod;
      await tManager.save(currentFunding);
    }

    // Create new funding, if exists
    if (changeFundingData.newFunding) {
      const funding = tManager.create(Funding, {
        ...changeFundingData.newFunding,
        enrollment,
      });
      await tManager.save(funding);
    }
  });
};

export const withdraw = async (
  id: number,
  user: User,
  withdrawData: WithdrawRequest
) => {
  const enrollment = await getEnrollment(id, user, true);

  enrollment.fundings = removeDeletedElements(enrollment.fundings || []);

  return getManager().transaction(async (tManager) => {
    const currentFunding = (enrollment.fundings || []).find(
      (f) => !f.lastReportingPeriod
    );
    if (currentFunding) {
      if (!withdrawData.funding?.lastReportingPeriod) {
        throw new BadRequestError(
          'Last reporting period for current funding must be provided.'
        );
      }

      currentFunding.lastReportingPeriod =
        withdrawData.funding.lastReportingPeriod;
      await tManager.save(currentFunding);
    }

    if (!withdrawData.exit || !withdrawData.exitReason) {
      throw new BadRequestError(
        'Exit date and exit reason must be provided to withdraw'
      );
    }

    enrollment.exit = withdrawData.exit;
    enrollment.exitReason = withdrawData.exitReason;
    await tManager.save(enrollment);
  });
};
