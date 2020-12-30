import { ValidationError } from 'class-validator';
import { Funding } from '../shared/models';

export function fundingBeginsAfterEnrollmentEntry(funding: Funding): boolean {
  const firstReportingPeriodErrors = funding.validationErrors?.filter(
    (e) => e.target === 'firstReportingPeriod'
  );
  if (!firstReportingPeriodErrors) return false;
  return firstReportingPeriodErrors
    .reduce(
      (acc: { [key: string]: string }[], e: ValidationError) =>
        e.constraints?.length ? acc.concat(e.constraints) : [],
      []
    )
    .reduce(
      (acc: string[], constraint) => acc.concat(Object.keys(constraint)),
      []
    )
    .includes('fundingBeforeEnrollment');
}
