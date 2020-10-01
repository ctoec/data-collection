import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

export const Foster: React.FC = () => (
  <>
    <FormField<Child, RadioButtonGroupProps, boolean | null>
      id="foster-button-group"
      getValue={(data) => data.at('foster')}
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
      name="foster"
      legend="Child lives with foster family"
      showLegend
      options={[
        {
          render: (props) => (
            <div>
              <RadioButton text="Yes" {...props} />
            </div>
          ),
          value: 'Yes',
        },
        {
          render: (props) => (
            <div>
              <RadioButton text="No" {...props} />
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
      status={getValidationStatusForField}
    />
  </>
);
