export enum FundingSource {
  CDC = 'Child Day Care',
  CSR = 'Competitive School Readiness',
  PSR = 'Priority School Readiness',
  SHS = 'State Head Start',
  SS = 'Smart Start',
}

export const FUNDING_SOURCE_FULL_VALUES: {[ key in keyof typeof FundingSource ]: string} = {
  CDC: 'CDC - Child Day Care',
  CSR: 'CSR - Competitive School Readiness',
  PSR: 'PSR - Priority School Readiness',
  SHS: 'SHS - State Head Start',
  SS: 'SS - Smart Start'
};
