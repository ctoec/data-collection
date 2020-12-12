import { AgeGroup, FundingSource, FundingTime } from '../models';
import { FundingSourceTime } from '../models/FundingSourceTime';

//  This enumerates all of the valid funding source/funding time combinations,
//  as well as all of the acceptable formats for each associated funding time
// TODO: should fulltime and fullday roll up to the same "time"?
// TODO: should parttime and partday roll up to the same "time"?
export const FUNDING_SOURCE_TIMES: FundingSourceTime[] = [
  {
    displayName: 'Child Day Care',
    fundingSources: [FundingSource.CDC],
    fundingTimes: [
      {
        value: FundingTime.FullTime,
        formats: ['1', FundingTime.FullTime, 'FT'],
      },
      {
        value: FundingTime.PartTime,
        formats: ['2', FundingTime.PartTime, 'PT'],
      },
      {
        value: FundingTime.SplitTime,
        formats: ['3', FundingTime.SplitTime, 'PT/FT'],
      },
    ],
  },
  {
    displayName: 'School Readiness',
    fundingSources: [FundingSource.PSR, FundingSource.CSR],
    ageGroupLimitations: [AgeGroup.Preschool],
    fundingTimes: [
      {
        value: FundingTime.FullDay,
        formats: ['4', FundingTime.FullDay, 'Full-day/Full-year', 'FD'],
      },
      {
        value: FundingTime.School,
        formats: ['5', 'School-day', FundingTime.School, 'SD'],
      },
      {
        value: FundingTime.PartDay,
        formats: ['6', FundingTime.PartDay, 'Part-day/Part-year', 'PD'],
      },
      {
        value: FundingTime.ExtendedDay,
        formats: ['7', FundingTime.ExtendedDay, 'Wraparound', 'ED'],
      },
    ],
  },
  {
    displayName: 'Smart Start',
    fundingSources: [FundingSource.SS],
    fundingTimes: [
      {
        value: FundingTime.School,
        formats: ['8', 'School day', 'SD', FundingTime.School],
      },
    ],
  },
  {
    displayName: 'State Head Start',
    fundingSources: [FundingSource.SHS],
    fundingTimes: [
      {
        value: FundingTime.AdditionalFull,
        formats: ['9', 'FD/FY', FundingTime.AdditionalFull],
      },
      {
        value: FundingTime.AdditionalSchool,
        formats: ['10', 'SD/SY', FundingTime.AdditionalSchool],
      },
      {
        value: FundingTime.AdditionalExtendedSchool,
        formats: ['11', 'SD/SY/EY', FundingTime.AdditionalExtendedSchool],
      },
      {
        value: FundingTime.ExtendedDayYear,
        formats: ['12', 'ED/EY', FundingTime.ExtendedDayYear],
      },
      {
        value: FundingTime.ExtendedYear,
        formats: ['13', 'EY', FundingTime.ExtendedYear],
      },
      {
        value: FundingTime.ExtendedDay,
        formats: ['14', 'ED', FundingTime.ExtendedDay],
      },
    ],
  },
];
