import React from 'react';
import { FormField, DateInput, DateInputProps } from '@ctoec/component-library';
import { parseDateChange } from '../../../../../utils/parseDateChange';
import { IncomeDetermination } from '../../../../../shared/models';
import { IncomeFormFieldProps } from './Common';

export const DeterminationDateField: React.FC<IncomeFormFieldProps> = ({
  determinationId,
}) => {
  return (
    <FormField<IncomeDetermination[], DateInputProps, Date | null>
      getValue={(data) =>
        data.find((det) => det.id === determinationId).at('determinationDate')
      }
      // Workaround to fix the infinite date render bug
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      id="determination-date-"
      label="Determination date"
    />
  );
};
