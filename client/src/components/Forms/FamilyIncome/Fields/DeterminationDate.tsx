import React from 'react';
import { FormField, DateInput, DateInputProps } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import { Moment } from 'moment';

/**
 * Component that holds a date picker calendar object that
 * lets a user pick a date and have that appear in the form
 * text fields. Uses a workaround to avoid the infinite render
 * that can result from takinga  date input because it returns
 * a moment but the function expects a simple date.
 */
export const DeterminationDateField: React.FC = () => {
  return (
    <FormField<IncomeDetermination, DateInputProps, Moment | null>
      getValue={(data) => data.at('determinationDate')}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      id="determination-date-"
      label="Determination date"
    />
  );
};
