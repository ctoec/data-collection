export enum FundingTime {
  Full = 'Full',
  Part = 'Part',
  Split = 'Split',
  ExtendedDay = 'ExtendedDay',
  ExtendedYear = 'ExtendedYear',
  School = 'School',
}

export interface FundingTimeInput {
  displayName: string;  //  A user-friendly version of this funding time
  formats: string[];    //  All accepted input formats for this funding time
  value: FundingTime;   //  The actual underlying funding time
}