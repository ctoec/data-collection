import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../../shared/models';

/**
 * Component for entering the last name of a child in an enrollment.
 */
export const LastNameField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('lastName')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="lastName"
      label="Last name"
    />
  );
};
