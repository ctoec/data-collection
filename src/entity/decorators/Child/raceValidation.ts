import { registerDecorator, ValidationOptions } from 'class-validator';
import { isChildRaceIndicated } from '../../../utils/isChildRaceIndicated';
import { Child } from '../../Child';

const childRaceNotNullMessage = 'Child race is required';

export function ChildRaceIndicated(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'race',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: childRaceNotNullMessage, ...validationOptions },
      validator: {
        validate(_, { object: child }) {
          return isChildRaceIndicated(child as Child);
        },
      },
    });
  };
}
