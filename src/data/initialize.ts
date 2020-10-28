import { getManager } from 'typeorm';
import { Organization, Site, FundingSpace, ReportingPeriod } from '../entity';
import { FundingSource } from '../../client/src/shared/models';
import {
  getReportingPeriodFromDates,
  reportingPeriods,
} from './reportingPeriods';
import { organizations } from './organizations';
import { sitesByOrgName } from './sites';
import { getFakeFundingSpaces } from './fundingSpace';

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
        const fundingSpacesToAdd = await Promise.all(
          getFakeFundingSpaces(organization).map((fs) => {
            return getManager().create(FundingSpace, fs);
          })
        );
        await getManager().save(fundingSpacesToAdd);
      }
    })
  );

  if (!(await getManager().find(ReportingPeriod)).length) {
    const reportingPeriodsToAdd = [];
    for (let fundingSource of Object.values(FundingSource)) {
      for (let dates of reportingPeriods) {
        const reportingPeriod = getManager().create(
          ReportingPeriod,
          getReportingPeriodFromDates(fundingSource as FundingSource, dates)
        );
        reportingPeriodsToAdd.push(reportingPeriod);
      }
    }
    await getManager().save(reportingPeriodsToAdd);
  }
};
