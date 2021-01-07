import { WorkSheet } from 'xlsx';
import { getManager } from 'typeorm';
import {
  FundingSource,
  AgeGroup,
  FundingTime,
  UniqueIdType,
} from '../../../client/src/shared/models';
import { FundingSpace, Organization, FundingTimeSplit } from '../../entity';
import { parse } from './utils';

class OrganizationRow {
  name: string = '';
  uniqueIdType: string = '';
  CDC_InfantToddler_FullTime: number = 0;
  CDC_InfantToddler_PartTime: number = 0;
  CDC_InfantToddler_SplitTime: number = 0;
  WEEKS_CDC_InfantToddler_SplitTime: string = '';
  CDC_Preschool_FullTime: number = 0;
  CDC_Preschool_PartTime: number = 0;
  CDC_Preschool_SplitTime: number = 0;
  WEEKS_CDC_Preschool_SplitTime: string = '';
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
  WEEKS_CDC_SchoolAge_SplitTime: string = '';
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
      const idType = Object.values(UniqueIdType).find(
        (value) => value.toLowerCase() === row.uniqueIdType?.toLowerCase()
      );
      let org = await getManager('script').findOne(Organization, {
        where: { providerName: row.name },
      });
      if (!org) {
        org = await getManager('script').save(
          getManager('script').create(Organization, {
            providerName: row.name,
            uniqueIdType: idType || UniqueIdType.Other,
          })
        );
        console.log(`\tCreated organization ${org.providerName}`);
        createdCount += 1;
      } else {
        console.log(`\tOrganization ${org.providerName} already exists`);
      }

      // Create funding spaces for org
      const fundingProps = ORGANIZATION_ROW_PROPS.filter(
        (prop) =>
          row[prop] &&
          parseInt(row[prop]) > 0 &&
          Object.keys(FundingSource).some((fs) => prop.startsWith(fs)) &&
          !prop.includes('WEEKS')
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
          org.id,
          row[fundingProp],
          fundingSourceKey === 'CDC' && fundingTimeKey === 'SplitTime'
            ? row[`WEEKS_${fundingSourceKey}_${ageGroupKey}_${fundingTimeKey}`]
            : undefined,
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
  split?: string,
  fundingSource?: FundingSource,
  ageGroup?: AgeGroup,
  time?: FundingTime
) {
  // Handle SS special case:
  // - always preschool
  // - always "school" time
  if (fundingSource === FundingSource.SS) {
    await _createFundingSpace(
      orgId,
      capacity,
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
  const { id: fundingSpaceId } = await _createFundingSpace(
    orgId,
    capacity,
    fundingSource,
    ageGroup,
    time
  );
  if (split) {
    const [part, full] = split.split('/').map((weeks) => parseInt(weeks));
    await createFundingTimeSplit(fundingSpaceId, part, full);
  }
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
    return fs;
  } catch (err) {
    console.error(
      `\t\tFailed to create funding space ${fundingSource} - ${ageGroup} - ${time} with capacity ${capacity}`,
      err
    );
  }
}

async function createFundingTimeSplit(
  fundingSpaceId: number,
  partTimeWeeks: number,
  fullTimeWeeks: number
) {
  const fundingTimeSplit = getManager('script').create(FundingTimeSplit, {
    fundingSpace: { id: fundingSpaceId },
    partTimeWeeks,
    fullTimeWeeks,
  });

  try {
    await getManager('script').save(fundingTimeSplit);
    console.log(
      `\t\t\tCreated funding time split ${partTimeWeeks}/${fullTimeWeeks} parttime/fulltime for funding space ${fundingSpaceId}`
    );
  } catch (err) {
    console.error(
      `\t\t\tFailed to create funding time split for funding space ${fundingSpaceId}`
    );
  }
}
