import { registerDecorator, ValidationOptions } from 'class-validator';
import { Moment } from 'moment';

const defaultMomentMessage = 'Date is invalid';

/**
 * Pass the validator a function as a context that takes in the value you're validating
 * and returns true for a valid value-- e.g.
 * @MomentComparison({
    context: (birthdate: Moment) => birthdate.isBefore(moment()),
    message: 'Birth date must be in the past',
  })
 * @param validationOptions 
 */
export function MomentComparison(
  validationOptions?: ValidationOptions & {
    context: (validatingValue: Moment) => boolean;
  }
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: propertyName,
      target: object.constructor,
      propertyName: propertyName,
      options: { message: defaultMomentMessage, ...validationOptions },
      validator: {
        validate(value: Moment) {
          if (!value) return true;
          return validationOptions.context(value);
        },
      },
    });
  };
}
