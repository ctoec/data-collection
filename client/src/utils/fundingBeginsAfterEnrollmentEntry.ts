import { Funding } from '../shared/models';

export function fundingBeginsAfterEnrollmentEntry(
  funding: Funding
): boolean | undefined {
  return funding.validationErrors?.some(
    (e) => e.property === 'firstReportingPeriod'
  );
}
