import { ValidationError } from 'class-validator';
import { Funding } from '../shared/models';

export function fundingBeginsAfterEnrollmentEntry(funding: Funding): boolean {
  const firstReportingPeriodErrors = funding.validationErrors?.filter(
    (e) => e.property === 'firstReportingPeriod'
  );
  if (!firstReportingPeriodErrors) return false;
  return true;
}
