import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../../../entity/Child';
import { getManager } from 'typeorm';
import { Enrollment } from '../../Enrollment';

const enrollmentDatesCannotOverlap =
  'Past enrollments must have an end date before the start of the current enrollment.';

export function EnrollmentDatesCannotOverlapValidation(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'enrollmentDatesDontOverlap',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: enrollmentDatesCannotOverlap, ...validationOptions },
      validator: {
        async validate(_, { object: child }) {
          const enrollments = await getManager().find(Enrollment, {
            where: {
              childId: (child as Child).id,
            },
          });
          const currentEnrollment = enrollments.find((e) => !e.exit);
          const pastEnrollments = enrollments.filter(
            (e) => e.id !== currentEnrollment.id
          );
          return pastEnrollments.every(
            (e) => e.exit && e.exit.isSameOrBefore(currentEnrollment.entry)
          );
        },
      },
    });
  };
}
