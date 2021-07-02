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
import { NumberInput } from 'carbon-components-react';

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

  return (
    <NumberInput
      value={dataDriller.at('income').value}
      hideSteppers={true}
      className="usa-label"
      onChange={(e) => {
        console.log('e.target.value', e.target.value);
        const income = parseCurrencyFromString(e.target.value);
        console.log('income', income);
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
      // status={
      //   hideStatus
      //     ? undefined
      //     : getValidationStatusForFieldInFieldset(
      //         dataDriller,
      //         dataDriller.at('income').path,
      //         {}
      //       )
      // }
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
