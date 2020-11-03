import { registerDecorator, ValidationOptions } from 'class-validator';
import { Enrollment } from '../../Enrollment';

const ageGroupsMustAgree =
  'Age groups of funding spaces must match the enrollments they are associated with.';

export function FundingAgeGroupMatchesEnrollment(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ageGroupMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: ageGroupsMustAgree, ...validationOptions },
      validator: {
        validate(_, { object: enrollment }) {
          if (!enrollment) return true;
          const enrollmentAgeGroup = (enrollment as Enrollment).ageGroup;
          const allFundings = (enrollment as Enrollment).fundings;
          return allFundings.every(
            (f) => f.fundingSpace.ageGroup === enrollmentAgeGroup
          );
        },
      },
    });
  };
}
