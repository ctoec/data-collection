import { WorkSheet } from 'xlsx';
import { getManager } from 'typeorm';
import { Site, Organization } from '../../entity';
import { Region } from '../../../client/src/shared/models';
import { parse } from './utils';

class SiteRow {
  name: string = '';
  parentOrgName: string = '';
  licenseId: string = '';
  naeycId: string = '';
  registryId: string = '';
  facilityCode: string = '';
}

const SITE_ROW_PROPS = Object.keys(new SiteRow());

export const createSiteData = async (sheetData: WorkSheet) => {
  const parsedData = parse<SiteRow>(sheetData, SITE_ROW_PROPS);

  console.log(`Attempting to create ${parsedData.length} sites...`);
  let createdCount = 0;

  for (const row of parsedData) {
    try {
      const { id: orgId } = await getManager('script').findOneOrFail(
        Organization,
        {
          where: { providerName: row.parentOrgName },
        }
      );
      const site = getManager('script').create(Site, {
        siteName: row.name,
        licenseNumber: parseInt(row.licenseId),
        naeycId: parseInt(row.naeycId),
        registryId: parseInt(row.registryId),
        facilityCode: parseInt(row.facilityCode),
        organizationId: orgId,
        titleI: false, // placeholder
        region: Region.East, // placeholder
      });

      const { siteName, organizationId } = await getManager('script').save(
        site
      );
      console.log(
        `\tCreated site ${siteName} for organization ${row.parentOrgName} (id: ${organizationId})`
      );
      createdCount += 1;
    } catch (err) {
      console.error(`\tError creating data for site ${row.name}`, err);
    }
  }

  console.log(`Successfully created ${createdCount} sites`);
};
