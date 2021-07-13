import { registerDecorator, ValidationOptions } from 'class-validator';
import { Moment } from 'moment';
import { Funding } from '../../../entity';

const message = 'Funding cannot begin before enrollment start date.';

export function FundingBeginsAfterEnrollmentEntry(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Funding, propertyName: string) {
    registerDecorator({
      name: 'firstReportingPeriodAfterEntry',
      target: object.constructor,
      propertyName,
      options: { message, ...validationOptions },
      constraints: [],
      validator: {
        validate(startDate: Moment, { object: funding }) {
          const { entry } = (funding as Funding)?.enrollment;
          if (!entry) return true; // Can't do this validation without the enrollment entry

          return startDate.isSameOrAfter(entry);
        },
      },
    });
  };
}
