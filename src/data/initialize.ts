import { getManager } from 'typeorm';
import {
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod
} from '../entity';
import {
  Region,
  AgeGroup,
  FundingSource
} from '../../client/src/shared/models';
import { reportingPeriods } from './reportingPeriods';
import moment from 'moment';
import { FUNDING_SOURCE_TIMES } from '../../client/src/shared/constants';

export const initialize = async () => {
  const qb = getManager().createQueryBuilder();

  let organization = await getManager().findOne(Organization, 1);
  if (!organization) {
    const _organization = getManager().create(Organization, {
      id: 1,
      providerName: 'Hogwarts Childcare',
    });
    organization = await getManager().save(_organization);
  }

  if (!(await getManager().findOne(Site, 1))) {
    const site1 = getManager().create(Site, {
      id: 1,
      siteName: 'Gryfinndor Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    await getManager().save(site1);
  }

  if (!(await getManager().findOne(Site, 2))) {
    const site2 = getManager().create(Site, {
      siteName: 'Hufflepuff Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    await getManager().save(site2);
  }

  if (!(await getManager().find(FundingSpace)).length) {
    let fundingSpacesToAdd = [];
    Object.values(AgeGroup).forEach((ageGroup) => {
      for (const source of Object.values(FundingSource)) {
        const match = FUNDING_SOURCE_TIMES.find((fst) =>
          fst.fundingSources.includes(source)
        );

        if (match) {
          const spaces = match.fundingTimes.map((fundingTime) => {
            return getManager().create(FundingSpace, {
              ageGroup,
              capacity: 10,
              source,
              time: fundingTime.value,
              organization,
            });
          });

          fundingSpacesToAdd = fundingSpacesToAdd.concat(spaces);
        }
      }
    });
    await getManager().save(fundingSpacesToAdd);
  }

  if (!(await getManager().find(ReportingPeriod)).length) {
    const reportingPeriodsToAdd = [];
    for (let fundingSource of [FundingSource.CDC, FundingSource.PSR]) {
      for (let dates of reportingPeriods) {
        const reportingPeriod = getManager().create(ReportingPeriod, {
          type: fundingSource,
          period: moment.utc(dates[0]),
          periodStart: moment.utc(dates[1]),
          periodEnd: moment.utc(dates[2]),
          dueAt: moment.utc(dates[3]),
        });
        reportingPeriodsToAdd.push(reportingPeriod);
      }
    }
    await getManager().save(reportingPeriodsToAdd);
  }
};
