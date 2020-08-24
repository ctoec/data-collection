import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

/**
 * Component for entering the first name of a child in an enrollment.
 */
export const FirstNameField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('firstName')}
      defaultValue=""
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="firstName"
      label="First name"
    />
  );
};
