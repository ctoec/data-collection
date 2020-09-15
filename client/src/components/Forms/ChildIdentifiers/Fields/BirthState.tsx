import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('birthState')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="birthState"
      label="State"
    />
  );
};
