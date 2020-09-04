import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../../shared/models';

/**
 * Component for entering the suffix of a child in an enrollment.
 */
export const SuffixField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('suffix')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="suffix"
      label="Suffix"
      optional
    />
  );
};
