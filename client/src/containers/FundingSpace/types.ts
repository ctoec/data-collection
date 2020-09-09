export interface FundingSpaceType {
  displayName: string;
  fundingSources: FundingSource[];
  contractSpaces: ContractSpace[];
}

export interface ContractSpace {
  displayName: string;
  formats: string[];
  time: FundingTime;
}

export const FUNDING_SPACE_TYPES: FundingSpaceType[] = [{
  displayName: 'Child Day Care',
  fundingSources: [FundingSource.CDC],
  contractSpaces: [{
    time: FundingTime.Full,
    displayName: 'Full time',
    formats: ['1', 'Full time', 'FT']
  },
  {
    time: FundingTime.Part,
    displayName: 'Part time',
    formats: ['2', 'Part time', 'PT']
  },
  {
    time: FundingTime.Split,
    displayName: 'Split time',
    formats: ['3', 'Split time', 'Part time/Full time', 'PT/FT']
  }]
}, {
  displayName: 'School Readiness',
  fundingSources: [FundingSource.PSR, FundingSource.CSR],
  contractSpaces: [{
    time: FundingTime.Full,
    displayName: 'Full-day',
    formats: ['4', 'Full-day', 'FD']
  },
  {
    time: FundingTime.School,
    displayName: 'School-day/School-year',
    formats: ['5', 'School-day', 'School-day/School-year', 'SD']
  },
  {
    time: FundingTime.Part,
    displayName: 'Part-day',
    formats: ['6', 'Part-day', 'PD']
  }, {
    time: FundingTime.ExtendedDay,
    displayName: 'Extended-day',
    formats: ['7', 'Extended-day', 'Part time/Full time', 'ED']
  }]
}, {
  displayName: 'Smart Start',
  fundingSources: [FundingSource.SS],
  contractSpaces: [{
    time: FundingTime.School,
    displayName: 'School-day/School-year',
    formats: ['8', 'School day', 'SD']
  }]
}, {
  displayName: 'State Head Start',
  fundingSources: [FundingSource.SHS],
  contractSpaces: [{
    time: FundingTime.ExtendedDay,
    displayName: 'Extended-day',
    formats: ['9', 'Extended day', 'ED']
  }, {
    time: FundingTime.ExtendedYear,
    displayName: 'Extended-year',
    formats: ['10', 'Extended-year', 'EY']
  }]
}];