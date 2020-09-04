import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../../shared/models';
/**
 * Component for entering the SASID of a child in an enrollment.
 */
export const SasidField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('sasid')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="sasid"
      label="SASID"
      optional
    />
  );
};
