import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC = () => {
  return (
    <FormField<Child, TextInputProps, string | null>
      getValue={(data) => data.at('birthTown')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={TextInput}
      type="input"
      id="birthTown"
      label="Town"
      status={getValidationStatusForFieldInFieldset}
    />
  );
};
