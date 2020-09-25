import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

/**
 * Component that receives the annual household income of a given
 * family and records that as part of the income determination.
 */
export const AnnualHouseholdIncomeField: React.FC = () => {
  return (
    <FormField<IncomeDetermination, TextInputProps, number | null>
      getValue={(data) => data.at('income')}
      type="input"
      parseOnChangeEvent={(e) => parseCurrencyFromString(e.target.value)}
      inputComponent={TextInput}
      id="income-determination"
      label="Annual household income"
      status={getValidationStatusForField}
    />
  );
};
