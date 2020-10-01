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
    <FormField<Child, RadioButtonGroupProps, boolean | null>
      getValue={(data) => data.at('receivesC4K')}
      preprocessForDisplay={(data) => {
        if (data == true) return 'Yes';
        else if (data == false) return 'No';
        else return 'Unknown';
      }}
      parseOnChangeEvent={(e) => {
        if (e.target.value != 'Unknown') return e.target.value == 'Yes';
        else return null;
      }}
      inputComponent={RadioButtonGroup}
      id="c4k-radio-group"
      name="careforkids"
      legend="Care 4 kids"
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
        {
          render: (props) => (
            <div>
              <RadioButton text="Unknown/Not collected" {...props} />
            </div>
          ),
          value: 'Unknown',
        },
      ]}
    />
  );
};
