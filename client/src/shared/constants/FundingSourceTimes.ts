import { FundingSource, FundingTime } from "../models";
import { FundingSourceTime } from "../models/FundingSourceTime";

//  This enumerates all of the valid funding source/funding time combinations,
//  as well as all of the acceptable formats for each associated funding time
export const FUNDING_SOURCE_TIMES: FundingSourceTime[] = [{
  displayName: 'Child Day Care',
  fundingSources: [FundingSource.CDC],
  fundingTimes: [{
    value: FundingTime.Full,
    displayName: 'Full time',
    formats: ['1', 'Full time', 'FT']
  },
  {
    value: FundingTime.Part,
    displayName: 'Part time',
    formats: ['2', 'Part time', 'PT']
  },
  {
    value: FundingTime.Split,
    displayName: 'Split time',
    formats: ['3', 'Split time', 'Part time/Full time', 'PT/FT']
  }]
}, {
  displayName: 'School Readiness',
  fundingSources: [FundingSource.PSR, FundingSource.CSR],
  fundingTimes: [{
    value: FundingTime.Full,
    displayName: 'Full-day',
    formats: ['4', 'Full-day', 'FD']
  },
  {
    value: FundingTime.School,
    displayName: 'School-day/School-year',
    formats: ['5', 'School-day', 'School-day/School-year', 'SD']
  },
  {
    value: FundingTime.Part,
    displayName: 'Part-day',
    formats: ['6', 'Part-day', 'PD']
  }, {
    value: FundingTime.ExtendedDay,
    displayName: 'Extended-day',
    formats: ['7', 'Extended-day', 'Part time/Full time', 'ED']
  }]
}, {
  displayName: 'Smart Start',
  fundingSources: [FundingSource.SS],
  fundingTimes: [{
    value: FundingTime.School,
    displayName: 'School-day/School-year',
    formats: ['8', 'School day', 'SD']
  }]
}, {
  displayName: 'State Head Start',
  fundingSources: [FundingSource.SHS],
  fundingTimes: [{
    value: FundingTime.ExtendedDay,
    displayName: 'Extended-day',
    formats: ['9', 'Extended day', 'ED']
  }, {
    value: FundingTime.ExtendedYear,
    displayName: 'Extended-year',
    formats: ['10', 'Extended-year', 'EY']
  }]
}];