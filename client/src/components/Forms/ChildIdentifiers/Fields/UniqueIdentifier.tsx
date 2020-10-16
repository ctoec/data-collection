import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';
/**
 * Component for entering the unique identifier of a child in an enrollment.
 */
export const UniqueIdentifierField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('uniqueIdentifier')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="uniqueId"
      label="Unique identifier"
      optional
      status={getValidationStatusForField}
    />
  );
};
