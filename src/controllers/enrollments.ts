import { removeDeletedElements } from '../utils/filterSoftRemoved';
import { getManager } from 'typeorm';
import { ChangeFunding, Withdraw } from '../../client/src/shared/payloads';
import { Enrollment, ReportingPeriod, Funding } from '../entity';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';

export const changeFunding = async (
  id: number,
  changeFundingData: ChangeFunding
) => {
  let enrollment = await getManager().findOne(Enrollment, id, {
    relations: ['fundings'],
  });
  enrollment.fundings = removeDeletedElements(enrollment.fundings || []);

  if (!enrollment) throw new NotFoundError();

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

      const lastReportingPeriod =
        oldFundingLastReportingPeriod ||
        (await tManager.findOne(ReportingPeriod, {
          where: {
            period: newFundingFirstReportingPeriod.period.add(-1, 'month'),
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

export const withdraw = async (id: number, withdrawData: Withdraw) => {
  let enrollment = await getManager().findOne(Enrollment, id, {
    relations: ['fundings'],
  });
  enrollment.fundings = removeDeletedElements(enrollment.fundings || []);

  if (!enrollment) throw new NotFoundError();

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

    if (!withdrawData.exitDate || !withdrawData.exitReason) {
      throw new BadRequestError(
        'Exit date and exit reason must be provided to withdraw'
      );
    }

    enrollment.exit = withdrawData.exitDate;
    enrollment.exitReason = withdrawData.exitReason;
    await tManager.save(enrollment);
  });
};
