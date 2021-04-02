import { registerDecorator, ValidationOptions } from 'class-validator';
import { getManager } from 'typeorm';
import { Child, Enrollment } from '../../../entity';
import { removeDeletedElements } from '../../../utils/filterSoftRemoved';

export function FundedEnrollmentValidation(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'fundedEnrollment',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Every child must have at least one funded enrollment',
        ...validationOptions,
      },
      validator: {
        async validate(_, { object: child }) {
          const enrollments = await getManager().find(Enrollment, {
            relations: ['fundings'],
            where: {
              childId: (child as Child).id,
            },
          });

          enrollments.forEach((enrollment) => {
            enrollment.fundings = removeDeletedElements(enrollment?.fundings);
          });

          return enrollments.some(
            (enrollment) => enrollment.fundings && enrollment.fundings.length
          );
        },
      },
    });
  };
}
