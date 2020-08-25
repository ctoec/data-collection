import { getManager } from 'typeorm';
import {
  User,
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod,
} from '../entity';
import {
  Region,
  AgeGroup,
  FundingSource,
  FundingTime,
} from '../../client/src/shared/modelss';
import { reportingPeriods } from './reportingPeriods';
import moment from 'moment';

export const initialize = async () => {
  const qb = getManager().createQueryBuilder();
  try {
    const user = getManager().create(User, {
      id: 1,
      wingedKeysId: '2c0ec653-8829-4aa1-82ba-37c8832bbb88',
      firstName: 'Voldy',
      lastName: 'Mort',
    });
    await qb.insert().into(User).values([user]).orIgnore().execute();
  } catch {}

  let organization;
  const orgName = 'Hogwarts Childcare';
  try {
    const _organization = getManager().create(Organization, {
      name: 'Hogwarts Childcare',
    });
    await qb
      .insert()
      .into(Organization)
      .values([_organization])
      .orIgnore()
      .execute();
  } catch {
  } finally {
    organization = await getManager().findOne(Organization, {
      where: { name: orgName },
    });
  }

  try {
    const site1 = getManager().create(Site, {
      name: 'Gryfinndor Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    const site2 = getManager().create(Site, {
      name: 'Hufflepuff Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    await qb.insert().into(Site).values([site1, site2]).orIgnore().execute();
  } catch {}

  try {
    const fundingSpacesToAdd = [];
    Object.values(AgeGroup).forEach((ageGroup) => {
      const CDCFullTime = getManager().create(FundingSpace, {
        ageGroup,
        capacity: 10,
        source: FundingSource.CDC,
        time: FundingTime.Full,
        organization,
      });

      const CDCPartTime = getManager().create(FundingSpace, {
        ageGroup,
        capacity: 10,
        source: FundingSource.CDC,
        time: FundingTime.Part,
        organization,
      });

      const PSRFull = getManager().create(FundingSpace, {
        ageGroup,
        capacity: 10,
        source: FundingSource.PSR,
        time: FundingTime.Full,
        organization,
      });

      const PSRPart = getManager().create(FundingSpace, {
        ageGroup,
        capacity: 10,
        source: FundingSource.PSR,
        time: FundingTime.Part,
        organization,
      });
      fundingSpacesToAdd.push(CDCFullTime, CDCPartTime, PSRFull, PSRPart);
    });
    await qb
      .insert()
      .into(FundingSpace)
      .values(fundingSpacesToAdd)
      .orIgnore()
      .execute();
  } catch {}

  try {
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
    await qb
      .insert()
      .into(ReportingPeriod)
      .values(reportingPeriodsToAdd)
      .orIgnore()
      .execute();
  } catch {}
};
