import React from 'react';
import { FormContext, useGenericContext } from '@ctoec/component-library';
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

  const validationStatus = getValidationStatusForFieldInFieldset(
    dataDriller,
    dataDriller.at('income').path,
    {}
  );

  return (
    <NumberInput
      value={dataDriller.at('income').value}
      className="usa-label"
      // @ts-ignore
      hideSteppers={true}
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
      invalid={hideStatus ? false : validationStatus !== undefined}
      invalidText={validationStatus?.message ?? ''}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
