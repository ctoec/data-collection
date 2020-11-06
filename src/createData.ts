import {
  createConnection,
  getManager,
  getConnectionOptions,
  getConnectionManager,
} from 'typeorm';
import { readFile, utils } from 'xlsx';
import {
  Organization,
  FundingSpace,
  Site,
  Enrollment,
  Funding,
  Family,
  Child,
  IncomeDetermination,
  FundingTimeSplit,
  Community,
  OrganizationPermission,
  SitePermission,
  User,
  CommunityPermission,
  ReportingPeriod,
} from './entity';
import {
  FundingSource,
  AgeGroup,
  FundingTime,
} from '../client/src/shared/models';

const fileName = process.env.DATA_FILE_NAME;
if (!fileName) throw Error('env var DATA_FILE_NAME must be set');

const dataType = process.env.DATA_TYPE;
if (!dataType) throw Error('env var DATA_TYPE must be set');

class OrganizationRow {
  name: string = '';
  uniqueIdType: string = '';
  fundingSpaces: string = '';
  CDC_InfantToddler_FullTime: number = 0;
  CDC_InfantToddler_PartTime: number = 0;
  CDC_InfantToddler_SplitTime: number = 0;
  CDC_Preschool_FullTime: number = 0;
  CDC_Preschool_PartTime: number = 0;
  CDC_Preschool_SplitTime: number = 0;
  PSR_Preschool_FullDay: number = 0;
  PSR_Preschool_SchoolDaySchoolYear: number = 0;
  PSR_Preschool_PartDay: number = 0;
  PSR_Preschool_ExtendedDay: number = 0;
  CSR_Preschool_FullDay: number = 0;
  CSR_Preschool_SchoolDaySchoolYear: number = 0;
  CSR_Preschool_PartDay: number = 0;
  SS: number = 0;
  CDC_SchoolAged_FullTime: number = 0;
  CDC_SchoolAged_PartTime: number = 0;
  CDC_SchoolAged_SplitTime: number = 0;
}
const OrganizationRowProps = Object.keys(new OrganizationRow());

class SiteRow {
  name: string = '';
  parentOrgName: string = '';
  licenseId: string = '';
  naeycId: string = '';
  registryId: string = '';
  facilityCode: string = '';
}

class UserRow {
  parentOrgName: string = '';
  userName: string = '';
  email: string = '';
  siteNames: string[] = [];
  uuid: string = '';
}

(async () => {
  const connectionOptions = await getConnectionOptions();
  const connection = await getConnectionManager().create({
    ...connectionOptions,
    name: 'script',
    entities: [
      Organization,
      Site,
      Enrollment,
      Funding,
      FundingSpace,
      Child,
      Family,
      IncomeDetermination,
      FundingTimeSplit,
      Community,
      OrganizationPermission,
      SitePermission,
      User,
      CommunityPermission,
      ReportingPeriod,
    ],
  });
  await connection.connect();

  console.log(await connection.manager.find(User));

  const rawData = readFile(fileName, {});
  const sheetData = Object.values(rawData.Sheets)[0];
  if (dataType.toUpperCase() === 'ORGANIZATION') {
    const parsedData = utils.sheet_to_json<OrganizationRow>(sheetData, {
      range: 1,
      header: OrganizationRowProps,
    });
    parsedData.forEach(async (orgRow) => {
      try {
        // Create org
        const org = getManager('script').create(Organization, {
          providerName: orgRow.name,
          // uniqueIdType:  TODO
        });
        console.log(getManager('script').connection.isConnected);
        // const { id: orgId } = await getManager('script').save(org);

        // Create funding spaces for org
        OrganizationRowProps.filter(
          (prop) =>
            orgRow[prop] &&
            Object.values(FundingSource).some((fs) =>
              prop.includes(fs.split('-')[0])
            )
        ).forEach(async (prop) => {
          const [fundingSourceKey, ageGroupKey, fundingTimeKey] = prop.split(
            '_'
          );
          const fundingSource = FundingSource[fundingSourceKey];
          const ageGroup = AgeGroup[ageGroupKey];
          const fundingTime = FundingTime[fundingTimeKey];
          console.log(fundingSource, ageGroup, fundingTime);
        });
        // 	await createFundingSpace(orgId, orgRow[prop], fundingSource as FundingSource, ageGroup as AgeGroup, fundingTime as FundingTime)
      } catch (err) {}
    });
  }

  await connection.close();
})();

async function createFundingSpace(
  orgId: number,
  capacity: number,
  fundingSource: FundingSource,
  ageGroup: AgeGroup,
  time: FundingTime
) {
  const fundingSpace = getManager().create(FundingSpace, {
    organizationId: orgId,
    capacity,
    source: fundingSource,
    ageGroup,
    time,
  });

  return getManager().save(fundingSpace);
}
