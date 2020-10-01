import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../../Child';

const childRaceNotNullMessage = 'Child race is required';
const raceFields = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
  'raceNotDisclosed',
];

function isChildRaceIndicated(child: Child) {
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
