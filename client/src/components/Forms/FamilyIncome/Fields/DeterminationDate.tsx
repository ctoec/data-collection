import React from 'react';
import {
  DateInput,
  DateInputProps,
  FormContext,
  FormField,
  useGenericContext,
} from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import { Moment } from 'moment';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import { set } from 'lodash';
import produce from 'immer';

/**
 * Component that holds a date picker calendar object that
 * lets a user pick a date and have that appear in the form
 * text fields. Uses a workaround to avoid the infinite render
 * that can result from takinga  date input because it returns
 * a moment but the function expects a simple date.
 */
export const DeterminationDateField: React.FC = () => {
  // Use a driller to keep clearing state synched between data
  // and the 'income not disclosed' box
  const {
    data: determination,
    dataDriller,
    updateData,
  } = useGenericContext<IncomeDetermination>(FormContext);
  return (
    <FormField<IncomeDetermination, DateInputProps, Moment | null>
      getValue={() => {
        return dataDriller.at('determinationDate');
      }}
      defaultValue={null}
      parseOnChangeEvent={(e: any) => {
        // Make sure to set not disclosed to false if we've entered info for
        // a partial det--prefer values over not disclosed
        const updatedDet = produce<IncomeDetermination>(
          determination,
          (draft) => {
            set(draft, dataDriller.at('determinationDate').path, e);
            set(draft, dataDriller.at('incomeNotDisclosed').path, false);
          }
        );
        updateData(updatedDet);
        return e;
      }}
      inputComponent={DateInput}
      id="determination-date-"
      label="Determination date"
      status={getValidationStatusForFieldInFieldset}
      disabled={dataDriller.at('incomeNotDisclosed').value}
    />
  );
};
