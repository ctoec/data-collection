import { getManager } from 'typeorm';
import {
  User,
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod,
  OrganizationPermission,
} from '../entity';
import {
  Region,
  AgeGroup,
  FundingSource,
  FundingTime,
} from '../../client/src/shared/models';
import { reportingPeriods } from './reportingPeriods';
import moment from 'moment';

export const initialize = async () => {
  const qb = getManager().createQueryBuilder();

  let user = await getManager().findOne(User, 1);
  if (!user) {
    const _user = getManager().create(User, {
      id: 1,
      wingedKeysId: '2c0ec653-8829-4aa1-82ba-37c8832bbb88',
      firstName: 'Voldy',
      lastName: 'Mort',
    });
    user = await getManager().save(_user);
  }

  let organization = await getManager().findOne(Organization, 1);
  if (!organization) {
    const _organization = getManager().create(Organization, {
      id: 1,
      name: 'Hogwarts Childcare',
    });
    organization = await getManager().save(_organization);
  }

  if (!(await getManager().findOne(OrganizationPermission, 1))) {
    const permission = getManager().create(OrganizationPermission, {
      user,
      organization,
    });
    await getManager().save(permission);
  }

  if (!(await getManager().findOne(Site, 1))) {
    const site1 = getManager().create(Site, {
      id: 1,
      name: 'Gryfinndor Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    await getManager().save(site1);
  }

  if (!(await getManager().findOne(Site, 2))) {
    const site2 = getManager().create(Site, {
      name: 'Hufflepuff Childcare',
      titleI: false,
      region: Region.East,
      organization,
    });
    await getManager().save(site2);
  }

  if (!(await getManager().find(FundingSpace)).length) {
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
