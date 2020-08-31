import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

/**
 * Component for entering a birth certificate id of a child in an enrollment.
 */
export const BirthCertificateIdField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('birthCertificateId')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="birthCertificateId"
      label="Birth certificate ID #"
    />
  );
};
