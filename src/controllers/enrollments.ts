import { getManager } from 'typeorm';
import { ChangeFunding } from '../../client/src/shared/payloads/ChangeFunding';
import { Enrollment, ReportingPeriod, Funding } from '../entity';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';

export const changeFunding = async (
  id: number,
  changeFundingData: ChangeFunding
) => {
  const enrollment = await getManager().findOne(Enrollment, id, {
    relations: ['fundings'],
  });

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
      // look up period from DB to enable later look up of
      // previous reporting period
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
