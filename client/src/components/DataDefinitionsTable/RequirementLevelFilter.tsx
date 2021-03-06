import React, { SetStateAction } from 'react';
import { RadioButtonGroup, RadioOption } from '@ctoec/component-library';

type RequirementLevelFilterProps = {
  setFilter: React.Dispatch<SetStateAction<boolean>>;
};
const TOGGLE_OPTS = { ALL_FIELDS: 'all', REQUIRED_FIELDS: 'required' };
export const RequirementLevelFilter: React.FC<RequirementLevelFilterProps> = ({
  setFilter,
}) => (
  <RadioButtonGroup
    className="requirement-level-filter"
    legend="Filter fields"
    id="filter-fields"
    inForm={false}
    inputName="field filter option"
    defaultSelectedItemId={TOGGLE_OPTS.ALL_FIELDS}
    options={
      [
        {
          text: 'All fields',
          id: TOGGLE_OPTS.ALL_FIELDS,
          value: TOGGLE_OPTS.ALL_FIELDS,
          onChange: () => setFilter(false),
        },
        {
          text: 'Only required  and conditionally required fields',
          id: TOGGLE_OPTS.REQUIRED_FIELDS,
          value: TOGGLE_OPTS.REQUIRED_FIELDS,
          onChange: () => setFilter(true),
        },
      ] as RadioOption[]
    }
  />
);
