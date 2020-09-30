import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Family } from '../../../../shared/models';

export const HomelessnessField: React.FC = () => {
  return (
    <>
      <FormField<Family, RadioButtonGroupProps, boolean | null>
        id="homelessness-button-group"
        getValue={(data) => data.at('homelessness')}
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
        name="homelessness"
        legend="Homelessness status"
        showLegend
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
            value: 'Unknown',
          },
        ]}
      />
    </>
  );
};
