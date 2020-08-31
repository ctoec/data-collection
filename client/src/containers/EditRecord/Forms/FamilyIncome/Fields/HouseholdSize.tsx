import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';
import { IncomeFormFieldProps } from './Common';

/**
 * Component that holds a field allowing the input and modification
 * of a household size number for an income determination.
 */
export const HouseholdSizeField: React.FC<IncomeFormFieldProps> = ({
  determinationId,
}) => {
  return (
    <FormField<IncomeDetermination, TextInputProps, number | null>
      getValue={(data) => data.at('numberOfPeople')}
      parseOnChangeEvent={(e) => parseInt(e.target.value, 10) || null}
      inputComponent={TextInput}
      id={'number-of-people'}
      label="Household size"
      small
    />
  );
};
