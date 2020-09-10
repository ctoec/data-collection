import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../shared/models';

/*
 * Basic functional component designed to allow user to edit
 * the Care For Kids field of a Child object.
 */
export const CareForKidsField: React.FC = () => {
  return (
    <FormField<Child, RadioButtonGroupProps, boolean>
      getValue={(data) => data.at('recievesC4K')}
      preprocessForDisplay={(data) => (data === true ? 'Yes' : 'No')}
      parseOnChangeEvent={(e) => {
        return e.target.value === 'Yes';
      }}
      inputComponent={RadioButtonGroup}
      id="c4k-radio-group"
      name="careforkids"
      legend="receives care for kids"
      options={[
        {
          render: (props) => (
            <div>
              <RadioButton text="Receiving Care 4 Kids" {...props} />
            </div>
          ),
          value: 'Yes',
        },
        {
          render: (props) => (
            <div>
              <RadioButton text="Not receiving Care 4 Kids" {...props} />
            </div>
          ),
          value: 'No',
        },
      ]}
    />
  );
};
