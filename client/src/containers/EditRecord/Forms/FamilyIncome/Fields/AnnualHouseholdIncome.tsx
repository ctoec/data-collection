import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';
import parseCurrencyFromString from '../../../../../utils/parseCurrencyFromString';

export const AnnualHouseholdIncomeField: React.FC = () => {
  return (
    <FormField<IncomeDetermination, TextInputProps, number | null>
      getValue={(data) => data.at('income')}
      parseOnChangeEvent={(e) => parseCurrencyFromString(e.target.value)}
      inputComponent={TextInput}
      id="income-determination"
      label="Annual household income"
    />
  );
};
