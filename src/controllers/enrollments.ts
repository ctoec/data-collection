import { removeDeletedElements } from '../utils/filterSoftRemoved';
import { getManager, In } from 'typeorm';
import { ChangeFunding, Withdraw } from '../../client/src/shared/payloads';
import { Enrollment, ReportingPeriod, Funding, User } from '../entity';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';
import moment from 'moment';

export const getEnrollment = async (
  id: number | string,
  user: User,
  withFundings?: boolean
) => {
  const enrollment = getManager().findOne(Enrollment, id, {
    where: { siteId: In(user.siteIds) },
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
    where: { enrollmentId: enrollmentId },
  });

  if (!funding) throw new NotFoundError();

  return funding;
};

export const changeFunding = async (
  id: number,
  user: User,
  changeFundingData: ChangeFunding
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
        newFundingFirstReportingPeriod.id &&
        !newFundingFirstReportingPeriod.period
      ) {
        newFundingFirstReportingPeriod.period = (
          await tManager.findOne(
            ReportingPeriod,
            newFundingFirstReportingPeriod.id
          )
        ).period;
      }

      // Check that the reporting period prior to the new funding reporting period
      // is not before July 2020 (the first date supported in the app)
      let periodBeforeNewFundingFirst = newFundingFirstReportingPeriod.period
        .clone()
        .add(-1, 'month');
      const EARLIEST_PERIOD = moment.utc('07-01-2020', ['DD-MM-YYYY']);
      if (periodBeforeNewFundingFirst < EARLIEST_PERIOD) {
        // If it is prior to July 2020, use that date instead
        periodBeforeNewFundingFirst = EARLIEST_PERIOD;
      }
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
  withdrawData: Withdraw
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
