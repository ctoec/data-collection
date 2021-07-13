import { registerDecorator, ValidationOptions } from 'class-validator';
import { Funding } from '../../Funding';

const endDateMustBeAfterStartDate = 'Funding end date must be after start date';

export function EndDateAfterStartDate(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'endDateStartDateComparison',
      target: object.constructor,
      propertyName,
      options: { message: endDateMustBeAfterStartDate, ...validationOptions },
      validator: {
        validate(_, { object: funding }) {
          if (!funding) return true;
          if (!(funding as Funding).startDate) return true;

          return (funding as Funding).startDate.isSameOrBefore(
            (funding as Funding).endDate
          );
        },
      },
    });
  };
}
