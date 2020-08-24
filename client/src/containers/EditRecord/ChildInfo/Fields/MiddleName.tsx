import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
/**
 * Component for entering the middle name of a child in an enrollment.
 */
export const MiddleNameField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('middleName')}
      defaultValue=""
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="middleName"
      label="Middle name"
      optional
    />
  );
};
