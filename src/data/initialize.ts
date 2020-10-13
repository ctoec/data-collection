import { getManager } from 'typeorm';
import { Organization, Site, FundingSpace, ReportingPeriod } from '../entity';
import { AgeGroup, FundingSource } from '../../client/src/shared/models';
import { reportingPeriods } from './reportingPeriods';
import moment from 'moment';
import { FUNDING_SOURCE_TIMES } from '../../client/src/shared/constants';
import { organizations } from './organizations';
import { sitesByOrgName } from './sites';

export const initialize = async () => {
  const qb = getManager().createQueryBuilder();

  await Promise.all(
    organizations.map(async (orgToCreate) => {
      let organization = await getManager().findOne(Organization, {
        providerName: orgToCreate.providerName,
      });
      if (!organization) {
        const _organization = getManager().create(Organization, orgToCreate);
        organization = await getManager().save(_organization);
      }

      const sites = sitesByOrgName[organization.providerName];
      await Promise.all(
        sites.map(async (siteToCreate) => {
          if (
            !(await getManager().findOne(Site, {
              siteName: siteToCreate.siteName,
            }))
          ) {
            const _site = getManager().create(Site, {
              ...siteToCreate,
              organization,
            });
            await getManager().save(_site);
          }
        })
      );

      if (!(await getManager().find(FundingSpace)).length) {
        let fundingSpacesToAdd = [];
        await Promise.all(
          Object.values(AgeGroup).map((ageGroup) => {
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
          })
        );
        await getManager().save(fundingSpacesToAdd);
      }
    })
  );

  if (!(await getManager().find(ReportingPeriod)).length) {
    const reportingPeriodsToAdd = [];
    for (let fundingSource of [
      FundingSource.CDC,
      FundingSource.PSR,
      FundingSource.SHS,
      FundingSource.SS,
    ]) {
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
