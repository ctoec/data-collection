import { registerDecorator, ValidationOptions } from 'class-validator';
import { Enrollment } from '../../Enrollment';

const exitDateMustBeAfterEntry =
  'Enrollment exit date must be after entry date.';

export function ExitDateAfterEntry(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'exitDateEntryDateCompariosn',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: exitDateMustBeAfterEntry, ...validationOptions },
      validator: {
        validate(_, { object: enrollment }) {
          if (!enrollment) return true;
          if (!(enrollment as Enrollment).exit) return true;
          return (enrollment as Enrollment).entry.isBefore(
            (enrollment as Enrollment).exit
          );
        },
      },
    });
  };
}
