import { FundingSource, FundingTime } from "../models";
import { FundingSourceTime } from "../models/FundingSourceTime";

//  This enumerates all of the valid funding source/funding time combinations,
//  as well as all of the acceptable formats for each associated funding time
export const FUNDING_SOURCE_TIMES: FundingSourceTime[] = [{
  displayName: 'Child Day Care',
  fundingSources: [FundingSource.CDC],
  fundingTimes: [{
    value: FundingTime.FullTime,
    formats: ['1', FundingTime.FullTime, 'FT']
  },
  {
    value: FundingTime.PartTime,
    formats: ['2', FundingTime.PartTime, 'PT']
  },
  {
    value: FundingTime.SplitTime,
    formats: ['3', FundingTime.SplitTime, 'Part time/Full time', 'PT/FT']
  }]
}, {
  displayName: 'School Readiness',
  fundingSources: [FundingSource.PSR, FundingSource.CSR],
  fundingTimes: [{
    value: FundingTime.FullDay,
    formats: ['4', FundingTime.FullDay, 'FD']
  },
  {
    value: FundingTime.School,
    formats: ['5', 'School-day', FundingTime.School, 'SD']
  },
  {
    value: FundingTime.PartDay,
    formats: ['6', FundingTime.PartDay, 'PD']
  }, {
    value: FundingTime.ExtendedDay,
    formats: ['7', FundingTime.ExtendedDay, 'Part time/Full time', 'ED']
  }]
}, {
  displayName: 'Smart Start',
  fundingSources: [FundingSource.SS],
  fundingTimes: [{
    value: FundingTime.School,
    formats: ['8', 'School day', 'SD']
  }]
}, {
  displayName: 'State Head Start',
  fundingSources: [FundingSource.SHS],
  fundingTimes: [{
    value: FundingTime.ExtendedDay,
    formats: ['9', FundingTime.ExtendedDay, 'ED']
  }, {
    value: FundingTime.ExtendedYear,
    formats: ['10', FundingTime.ExtendedYear, 'EY']
  }]
}];