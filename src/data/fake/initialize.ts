import { EntityManager, getManager } from 'typeorm';
import {
  Organization,
  Site,
  FundingSpace,
  ReportingPeriod,
  Funding,
  Enrollment,
  Child,
  Family,
  IncomeDetermination,
  SitePermission,
  OrganizationPermission,
  EnrollmentReport,
  User,
  OECReport,
} from '../../entity';
import { FundingSource, Region } from '../../../client/src/shared/models';
import {
  getReportingPeriodFromDates,
  reportingPeriods,
} from './reportingPeriods';
import { organizations } from './organizations';
import { sitesByOrgName } from './sites';
import { getFakeFundingSpaces } from './fundingSpace';
import { isDevelopment } from '../../utils/isDevelopment';

export const initialize = async () => {
  if (!isDevelopment()) {
    await getManager().createQueryBuilder().delete().from(Funding).execute();
    await getManager().createQueryBuilder().delete().from(Enrollment).execute();
    await getManager().createQueryBuilder().delete().from(Child).execute();
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(IncomeDetermination)
      .execute();
    await getManager().createQueryBuilder().delete().from(Family).execute();

    await getManager()
      .createQueryBuilder()
      .delete()
      .from(EnrollmentReport)
      .execute();

    await getManager()
      .createQueryBuilder()
      .delete()
      .from(SitePermission)
      .execute();

    await getManager()
      .createQueryBuilder()
      .delete()
      .from(OrganizationPermission)
      .execute();
    await getManager().createQueryBuilder().delete().from(OECReport).execute();
    await getManager().createQueryBuilder().delete().from(User).execute();
    await getManager().createQueryBuilder().delete().from(Site).execute();
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(FundingSpace)
      .execute();
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(Organization)
      .execute();
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(ReportingPeriod)
      .execute();

    await createDummyRows();
  }

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

/**
 * Create an intentionally unused row across all of our database tables, to ensure that
 * data is always present in the db post-deploy (even in our test environments).  Necessary to
 * properly reflect our prod environment when running migrations (which of course already has
 * data populated.)
 */
async function createDummyRows() {
  const manager: EntityManager = await getManager();

  const organization: Organization = await manager.save(
    manager.create(Organization, {
      providerName: 'DUMMY_PROVIDER_NAME',
    })
  );

  const site: Site = await manager.save(
    manager.create(Site, {
      organization,
      region: Region.East,
      siteName: 'DUMMY_SITE_NAME',
      titleI: false,
    })
  );

  const family: Family = await manager.save(
    manager.create(Family, {
      organization,
      streetAddress: 'DUMMY_STREET_ADDRESS',
    })
  );

  const child: Child = await manager.save(
    manager.create(Child, {
      family,
      firstName: 'DUMMY_FIRST_NAME',
      lastName: 'DUMMY_LAST_NAME',
      organization,
    })
  );

  const enrollment: Enrollment = await manager.save(
    manager.create(Enrollment, { child })
  );

  const user: User = await manager.save(
    manager.create(User, {
      firstName: 'DUMMY_FIRST_NAME',
      lastName: 'DUMMY_LAST_NAME',
      wingedKeysId: 'DUMMY_WINGEDKEYS_ID',
    })
  );

  await manager.save<Funding>(manager.create(Funding, { enrollment }));

  await manager.save<SitePermission>(
    manager.create(SitePermission, { site, user })
  );
  await manager.save(
    manager.create(OrganizationPermission, { organization, user })
  );

  await manager.save(manager.create(IncomeDetermination, { family }));
  await manager.save(manager.create(EnrollmentReport, { children: [child] }));
  await manager.save(manager.create(OECReport, { organization }));
}
