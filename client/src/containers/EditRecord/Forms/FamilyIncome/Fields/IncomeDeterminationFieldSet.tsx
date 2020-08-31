import React from 'react';
import { FormFieldSet } from '@ctoec/component-library';
import {
  AnnualHouseholdIncomeField,
  HouseholdSizeField,
  DeterminationDateField,
} from '.';
import { IncomeDetermination } from '../../../../../shared/models';

type IncomeDeterminationFieldSetProps = {
  type: 'new' | 'redetermine' | 'edit';
  determinationId: number;
};

export const IncomeDeterminationFieldSet: React.FC<IncomeDeterminationFieldSetProps> = ({
  type,
  determinationId,
}) => {
  let status, elementId, legend, showLegend;
  switch (type) {
    case 'redetermine':
      elementId = 'family-income-redetermination';
      legend = 'Redetermine family income';
      showLegend = true;
      break;

    case 'edit':
      elementId = `family-income-determination-edit-${determinationId}`;
      legend = 'Edit family income';
      showLegend = true;
      break;

    case 'new':
      elementId = 'family-income-determination';
      legend = 'Family income determination';
      showLegend = false;
      break;
  }

  return (
    <FormFieldSet<IncomeDetermination[]>
      id={elementId}
      legend={legend}
      showLegend={showLegend}
      legendStyle="title"
    >
      <div>
        <HouseholdSizeField determinationId={determinationId} />
      </div>
      <div>
        <AnnualHouseholdIncomeField determinationId={determinationId} />
      </div>
      <div>
        {/* <DeterminationDateField determinationId={determinationId} /> */}
      </div>
    </FormFieldSet>
  );
};
