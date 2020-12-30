import { registerDecorator, ValidationOptions } from 'class-validator';
import { Funding, ReportingPeriod } from '../../../entity';

const message = 'Funding cannot begin before enrollment start date.';

export function FundingBeginsAfterEnrollmentEntry(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Funding, propertyName: string) {
    registerDecorator({
      name: 'firstReportingPeriod',
      target: object.constructor,
      propertyName,
      options: { message, ...validationOptions },
      constraints: [{ fundingBeforeEnrollment: message }],
      validator: {
        validate(reportingPeriod: ReportingPeriod, { object: funding }) {
          // Handle edge case of undefined object
          // This can happen if a record has no age group, in which case
          // we still want to create and save the funding so that other
          // fields get saved. Missing age group will already be flagged.
          if (!reportingPeriod) return true;
          const { entry } = (funding as Funding)?.enrollment;
          const endFirstReportingPeriod = reportingPeriod.periodEnd;
          if (!entry || !endFirstReportingPeriod) return true;
          // The end of the first reporting period must be after the enrollment start
          const isValid = entry.isBefore(endFirstReportingPeriod);
          // Delete the enrollment from funding bc it was added in the validation process.  See enrollment entity
          delete (funding as Funding)?.enrollment;
          return isValid;
        },
      },
    });
  };
}
