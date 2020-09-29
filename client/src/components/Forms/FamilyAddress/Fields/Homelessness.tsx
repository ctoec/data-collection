import React from 'react';
import {
  FormField,
  CheckboxProps,
  Checkbox,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Family } from '../../../../shared/models';

export const HomelessnessField: React.FC = () => {
  return (
    <>
      <p className="text-bold margin-top-3 margin-bottom-1">
        Homelessness status
      </p>
      <FormField<Family, RadioButtonGroupProps, boolean | null>
        id="homelessness-button-group"
        getValue={(data) => data.at('homelessness')}
        preprocessForDisplay={(data) => {
          if (data == true) return 'Yes';
          else if (data == false) return 'No';
          else return 'null';
        }}
        parseOnChangeEvent={(e) => {
          if (e.target.value != 'null') return e.target.value == 'Yes';
          else return null;
        }}
        inputComponent={RadioButtonGroup}
        name="homelessness"
        legend=""
        options={[
          {
            render: (props) => (
              <div>
                <RadioButton
                  text="Child is currently experiencing homelessness"
                  {...props}
                />
              </div>
            ),
            value: 'Yes',
          },
          {
            render: (props) => (
              <div>
                <RadioButton
                  text="Child is not currently experiencing homelessness"
                  {...props}
                />
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
            value: 'null',
          },
        ]}
      />
    </>
  );
};
