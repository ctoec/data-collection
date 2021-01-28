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
import { HideErrorProps } from '../../types';

/**
 * Component that receives the annual household income of a given
 * family and records that as part of the income determination.
 */
export const AnnualHouseholdIncomeField: React.FC<HideErrorProps> = ({
  hideStatus,
}) => {
  const {
    data: determination,
    dataDriller,
    updateData,
  } = useGenericContext<IncomeDetermination>(FormContext);

  // Needed for the error state where EditRecord prompts the user for
  // a child's first income determination; don't show field with
  // red boundaries, in that case
  let errorDisplay;
  if (hideStatus) errorDisplay = undefined;
  else
    errorDisplay = getValidationStatusForFieldInFieldset(
      dataDriller,
      dataDriller.at('income').path,
      {}
    );
  return (
    <TextInput
      value={dataDriller.at('income').value}
      type="input"
      onChange={(e) => {
        const income = parseCurrencyFromString(e.target.value);
        // Make sure to set not disclosed to false if we've entered info for
        // a partial det--prefer values over not disclosed
        const updatedDet = produce<IncomeDetermination>(
          determination,
          (draft) => {
            set(draft, dataDriller.at('income').path, income);
            set(draft, dataDriller.at('incomeNotDisclosed').path, false);
          }
        );
        updateData(updatedDet);
        return income;
      }}
      id="income-determination"
      label="Annual household income"
      status={errorDisplay}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
