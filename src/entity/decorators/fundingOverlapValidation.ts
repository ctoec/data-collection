import { registerDecorator, ValidationOptions } from 'class-validator';
import { Enrollment } from "../Enrollment";

// Make sure first reporting period of a funding is after the last reporting period of the previous funding

const fundingPeriodOverlap = 'Cannot claim a child twice in a reporting period';

export function FundingDoesNotOverlap(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'fundingOverlap',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: fundingPeriodOverlap, ...validationOptions },
      constraints: [{ childRace: fundingPeriodOverlap }],
      validator: {
        validate(_, { object: enrollment }) {
          const _funding = enrollment as Enrollment;
          // return _funding.firstReportins
          console.log(enrollment)
          return false;
        },
      },
    });
  };
}