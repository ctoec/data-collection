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
import { HideErrorProps } from '../../types';

/**
 * Component that holds a field allowing the input and modification
 * of a household size number for an income determination.
 */
export const HouseholdSizeField: React.FC<HideErrorProps> = ({
  hideStatus,
}) => {
  // Use a driller to keep clearing state synched between data
  // and the 'income not disclosed' box
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
      dataDriller.at('numberOfPeople').path,
      {}
    );
  return (
    <TextInput
      value={dataDriller.at('numberOfPeople').value}
      type="input"
      onChange={(e) => {
        const size = parseInt(e.target.value, 10) || null;
        // Make sure to set not disclosed to false if we've entered info for
        // a partial det--prefer values over not disclosed
        const updatedDet = produce<IncomeDetermination>(
          determination,
          (draft) => {
            set(draft, dataDriller.at('numberOfPeople').path, size);
            set(draft, dataDriller.at('incomeNotDisclosed').path, false);
          }
        );
        updateData(updatedDet);
        return size;
      }}
      id="number-of-people"
      label="Household size"
      small
      status={errorDisplay}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
