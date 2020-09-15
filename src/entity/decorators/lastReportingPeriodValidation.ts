import { registerDecorator, ValidationOptions } from 'class-validator';
import { Funding } from '../Funding';

// Make sure last reporting period is after the first

const lastReportingPeriodInvalid = 'Last reporting period must be after first';

export function LastReportingPeriodAfterFirst(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'lastReportingPeriod',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: lastReportingPeriodInvalid, ...validationOptions },
      constraints: [{ reportingPeriod: lastReportingPeriodInvalid }],
      validator: {
        validate(_, { object: funding }) {
          const {
            firstReportingPeriod,
            lastReportingPeriod,
          } = funding as Funding;
          if (!firstReportingPeriod || !lastReportingPeriod) return true;
          return firstReportingPeriod.period.isBefore(
            lastReportingPeriod.period
          );
        },
      },
    });
  };
}
