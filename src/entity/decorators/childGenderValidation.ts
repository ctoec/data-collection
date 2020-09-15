import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../Child';
import { Gender } from '../../../client/src/shared/models/Gender';

const childGenderSpecifiedMessage = 'Child gender must be specified';

export function ChildGenderSpecified(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'gender',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: childGenderSpecifiedMessage, ...validationOptions },
      constraints: [{ gender: childGenderSpecifiedMessage }],
      validator: {
        validate(_, { object: child }) {
          return (child as Child).gender !== Gender.NotSpecified;
        },
      },
    });
  };
}
