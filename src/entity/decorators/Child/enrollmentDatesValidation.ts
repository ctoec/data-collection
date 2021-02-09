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
          // Need some defensive cases for missing info so the validaiton
          // doesn't infinitely crash
          if (!enrollments || enrollments.length === 0) return true;
          const currentEnrollment = enrollments.find((e) => !e.exit);
          if (!currentEnrollment || !currentEnrollment.entry) return true;
          const pastEnrollments = enrollments.filter(
            (e) => e.id !== currentEnrollment.id
          );
          // Want to enforce that all past enrollments *do* have an exit
          // date before current enrollment, so no vacuous case for that
          return pastEnrollments.every(
            (e) => e.exit && e.exit.isSameOrBefore(currentEnrollment.entry)
          );
        },
      },
    });
  };
}
