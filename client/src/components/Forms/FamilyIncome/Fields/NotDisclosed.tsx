import React from 'react';
import { IncomeDetermination } from '../../../../shared/models';
import {
  Checkbox,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import { set } from 'lodash';
import produce from 'immer';

export const NotDisclosedField: React.FC = () => {
  // Need to track this as if it were state, so use a driller to
  // keep everything properly updated when manipulating the object
  const {
    data: determination,
    dataDriller,
    updateData,
  } = useGenericContext<IncomeDetermination>(FormContext);
  return (
    <Checkbox
      id="income-not-disclosed-checkbox"
      text="Income not disclosed"
      checked={dataDriller.at('incomeNotDisclosed').value}
      onChange={(e) => {
        const check = e.target.checked;
        const updatedDet = produce<IncomeDetermination>(
          determination,
          (draft) => {
            // Bulk update to avoid synchronization issues
            set(draft, dataDriller.at('incomeNotDisclosed').path, check);
            set(draft, dataDriller.at('numberOfPeople').path, null);
            set(draft, dataDriller.at('income').path, null);
            set(draft, dataDriller.at('determinationDate').path, undefined);
          }
        );
        updateData(updatedDet);
        return check;
      }}
    />
  );
};
