import React from 'react';
import {
  TextInput,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import { set } from 'lodash';
import produce from 'immer';

/**
 * Component that receives the annual household income of a given
 * family and records that as part of the income determination.
 */
export const AnnualHouseholdIncomeField: React.FC = () => {
  const {
    data: determination,
    dataDriller,
    updateData,
  } = useGenericContext<IncomeDetermination>(FormContext);
  return (
    <TextInput
      value={dataDriller.at('income').value}
      type="input"
      onChange={(e) => {
        const income = parseCurrencyFromString(e.target.value);
        updateData(
          produce<IncomeDetermination>(determination, (draft) =>
            set(draft, dataDriller.at('income').path, income)
          )
        );
        return income;
      }}
      id="income-determination"
      label="Annual household income"
      status={getValidationStatusForFieldInFieldset(
        dataDriller,
        dataDriller.at('income').path,
        {}
      )}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
