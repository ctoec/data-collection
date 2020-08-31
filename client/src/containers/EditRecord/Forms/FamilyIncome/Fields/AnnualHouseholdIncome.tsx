import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';
import parseCurrencyFromString from '../../../../../utils/parseCurrencyFromString';
import { IncomeFormFieldProps } from './Common';

export const AnnualHouseholdIncomeField: React.FC<IncomeFormFieldProps> = ({
  determinationId,
}) => {
  return (
    <FormField<IncomeDetermination[], TextInputProps, number | null>
      getValue={(data) =>
        data.find((det) => det.id === determinationId).at('income')
      }
      parseOnChangeEvent={(e) => parseCurrencyFromString(e.target.value)}
      inputComponent={TextInput}
      id="income-determination"
      label="Annual household income"
    />
  );
};
