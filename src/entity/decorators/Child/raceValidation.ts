import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../../Child';

const childRaceNotNullMessage = 'Child race is required';
const raceFields = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
];

function isChildRaceIndicated(child: Child) {
  raceFields.forEach((field) => {
    const val = child[field];
    if (val) {
      return true;
    }
  });
  return false;
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
      constraints: [{ childRace: childRaceNotNullMessage }],
      validator: {
        validate(_, { object: child }) {
          return isChildRaceIndicated(child as Child);
        },
      },
    });
  };
}
