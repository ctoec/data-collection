import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../../Child';

const birthTownMessage =
  'Birth town must be provided or unknown for US birth certificates.';
const birthStateMessage =
  'Birth state must be provided or unknown for US birth certificates.';

/**
 * Null represents the "not collected state"; an empty string indicates this data
 * is plain old missing
 * @param child
 * @param field
 */
function isBirthCertificateFieldValid(child: Child, field: string) {
  return (
    child[field] === null || // null -> unknown
    child[field] !== ''
  ); // otherwise, value is required
}

export function ChildBirthCertificateSpecified(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'birthCertificate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          propertyName === 'birthTown' ? birthTownMessage : birthStateMessage,
        ...validationOptions,
      },
      validator: {
        validate(_, { object: child }) {
          return isBirthCertificateFieldValid(child as Child, propertyName);
        },
      },
    });
  };
}
