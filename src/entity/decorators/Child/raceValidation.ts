import { registerDecorator, ValidationOptions } from 'class-validator';
import { raceFields } from '../../../utils/raceFields';
import { Child } from '../../Child';

const childRaceNotNullMessage = 'Child race is required';

function isChildRaceIndicated(child: Child) {
  if (child.raceNotDisclosed) return true;
  return !raceFields.every((field) => !child[field]);
}

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
