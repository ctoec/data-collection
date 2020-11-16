import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
/**
 * Component for entering the unique id of a child in an enrollment.
 */
export const UniqueIdField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('uniqueId')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="unique-id"
      label="Unique Id"
      optional
    />
  );
};
