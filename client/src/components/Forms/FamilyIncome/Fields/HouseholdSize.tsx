import React from 'react';
import {
  TextInput,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import { set } from 'lodash';
import produce from 'immer';

/**
 * Component that holds a field allowing the input and modification
 * of a household size number for an income determination.
 */
export const HouseholdSizeField: React.FC = () => {
  const {
    data: determination,
    dataDriller,
    updateData,
  } = useGenericContext<IncomeDetermination>(FormContext);
  return (
    <TextInput
      value={dataDriller.at('numberOfPeople').value}
      type="input"
      onChange={(e) => {
        const size = parseInt(e.target.value, 10) || null;
        updateData(
          produce<IncomeDetermination>(determination, (draft) =>
            set(draft, dataDriller.at('numberOfPeople').path, size)
          )
        );
      }}
      id="number-of-people"
      label="Household size"
      small
      status={getValidationStatusForFieldInFieldset(
        dataDriller,
        dataDriller.at('numberOfPeople').path,
        {}
      )}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
