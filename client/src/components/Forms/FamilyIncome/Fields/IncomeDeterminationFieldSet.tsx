import React from 'react';
import { FormFieldSet } from '@ctoec/component-library';
import {
  AnnualHouseholdIncomeField,
  HouseholdSizeField,
  DeterminationDateField,
} from '.';
import { IncomeDetermination } from '../../../../shared/models';

/**
 * Simple prop holder to identify the kind of operation the
 * form field is performing (creating a new determination or
 * editing an existing one) as well as well as to maintain a
 * copy of the ID of the determination being edited.
 */
type IncomeDeterminationFieldSetProps = {
  type: 'redetermine' | 'edit';
};

/**
 * Component that uses scenario-based reasoning to assign variables
 * based on whether we're making a new determination or editing an
 * existing one. Renders the appropriate individual fields that
 * allow a user to redetermine income or edit an existing determination.
 */
export const IncomeDeterminationFieldSet: React.FC<IncomeDeterminationFieldSetProps> = ({
  type = 'edit',
}) => {
  let elementId, legend, showLegend;
  switch (type) {
    case 'redetermine':
      elementId = 'family-income-redetermination';
      legend = 'Redetermine family income';
      showLegend = false;
      break;

    case 'edit':
    default:
      elementId = `family-income-determination-edit`;
      legend = 'Edit family income';
      showLegend = true;
      break;
  }

  return (
    <FormFieldSet<IncomeDetermination>
      id={elementId}
      legend={legend}
      showLegend={showLegend}
    >
      <div>
        <HouseholdSizeField />
      </div>
      <div>
        <AnnualHouseholdIncomeField />
      </div>
      <div>
        <DeterminationDateField />
      </div>
    </FormFieldSet>
  );
};
