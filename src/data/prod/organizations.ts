import { WorkSheet, utils } from 'xlsx';
import { getManager } from 'typeorm';
import {
  FundingSource,
  AgeGroup,
  FundingTime,
} from '../../../client/src/shared/models';
import { FundingSpace, Organization } from '../../entity';
import { parse } from './utils';

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
  PSR_Preschool_School: number = 0;
  PSR_Preschool_PartDay: number = 0;
  PSR_Preschool_ExtendedDay: number = 0;
  CSR_Preschool_FullDay: number = 0;
  CSR_Preschool_School: number = 0;
  CSR_Preschool_PartDay: number = 0;
  SS: number = 0;
  CDC_SchoolAge_FullTime: number = 0;
  CDC_SchoolAge_PartTime: number = 0;
  CDC_SchoolAge_SplitTime: number = 0;
  SHS__AdditionalFull: string = '';
  SHS__AdditionalSchool: string = '';
  SHS__AdditionalExtendedSchool: string = '';
  SHS__ExtendedDayYear: string = '';
  SHS__ExtendedYear: string = '';
  SHS__ExtendedDay: string = '';
}

const ORGANIZATION_ROW_PROPS = Object.keys(new OrganizationRow());

export const createOrganizationData = async (sheetData: WorkSheet) => {
  const parsedData = parse<OrganizationRow>(sheetData, ORGANIZATION_ROW_PROPS);

  console.log(`Attempting to create ${parsedData.length} organizations...`);
  let createdCount = 0;

  for (const row of parsedData) {
    try {
      // Create org
      const org = getManager('script').create(Organization, {
        providerName: row.name,
        // uniqueIdType:  TODO
      });

      const { id: orgId, providerName } = await getManager('script').save(org);
      console.log(`\tCreated organization ${providerName}`);
      createdCount += 1;

      // Create funding spaces for org
      const fundingProps = ORGANIZATION_ROW_PROPS.filter(
        (prop) =>
          row[prop] &&
          Object.keys(FundingSource).some((fs) => prop.includes(fs))
      );

      for (const fundingProp of fundingProps) {
        const [
          fundingSourceKey,
          ageGroupKey,
          fundingTimeKey,
        ] = fundingProp.split('_');
        const fundingSource = FundingSource[fundingSourceKey];
        const ageGroup = AgeGroup[ageGroupKey];
        const fundingTime = FundingTime[fundingTimeKey];
        await createFundingSpace(
          orgId,
          row[fundingProp],
          fundingSource,
          ageGroup,
          fundingTime
        );
      }
    } catch (err) {
      console.error(`\tError creating organization ${row.name}`, err);
    }
  }

  console.log(`Successfully created ${createdCount} organizations`);
};

async function createFundingSpace(
  orgId: number,
  capacity: number,
  fundingSource?: FundingSource,
  ageGroup?: AgeGroup,
  time?: FundingTime
) {
  // Handle SS special case:
  // - funded on a classroom basis, where 1 classroom = 15 slots
  // - always preschool
  // - always "school" time
  if (fundingSource === FundingSource.SS) {
    await _createFundingSpace(
      orgId,
      capacity * 15,
      fundingSource,
      AgeGroup.Preschool,
      FundingTime.School
    );
    return;
  }

  // Handle SHS special case:
  // - not funded on a capacity basis, so set capacity to -1
  // - always all age groups
  if (fundingSource === FundingSource.SHS) {
    const ageGroups = Object.values(AgeGroup);
    for (const _ageGroup of ageGroups) {
      await _createFundingSpace(orgId, -1, fundingSource, _ageGroup, time);
    }
    return;
  }

  // Normal case for CDC, PSR, CSR
  await _createFundingSpace(orgId, capacity, fundingSource, ageGroup, time);
}

async function _createFundingSpace(
  orgId: number,
  capacity: number,
  fundingSource: FundingSource,
  ageGroup: AgeGroup,
  time: FundingTime
) {
  const fundingSpace = getManager('script').create(FundingSpace, {
    organizationId: orgId,
    capacity,
    source: fundingSource,
    ageGroup,
    time,
  });

  try {
    const fs = await getManager('script').save(fundingSpace);
    console.log(
      `\t\tCreated funding space ${fs.source} - ${fs.ageGroup} - ${fs.time} with capacity ${fs.capacity}`
    );
  } catch (err) {
    console.error(
      `\t\tFailed to create funding space ${fundingSource} - ${ageGroup} - ${time} with capacity ${capacity}`,
      err
    );
  }
}
