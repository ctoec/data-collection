import { registerDecorator, ValidationOptions } from 'class-validator';
import { Child } from '../../Child';

const childUSCertificateMessage =
  'Birth certificate ID, birth town, and birth state are required for US birth certificates.';
const birthFieldsForUSCert = ['birthCertificateId', 'birthTown', 'birthState'];

function isBirthCertificateValid(child: Child) {
  return (
    child.birthCertificateType !== 'US birth certificate' ||
    birthFieldsForUSCert.every((field) => {
      return child[field] !== undefined && child[field] !== '';
    })
  );
}

export function ChildBirthCertificateSpecified(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'birthCertificate',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: childUSCertificateMessage, ...validationOptions },
      validator: {
        validate(_, { object: child }) {
          return isBirthCertificateValid(child as Child);
        },
      },
    });
  };
}
