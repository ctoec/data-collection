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
        if (data === true) return 'foster-yes';
        else if (data === false) return 'foster-no';
        else return 'foster-unknown';
      }}
      parseOnChangeEvent={(e) => {
        if (e.target.value !== 'foster-unknown')
          return e.target.value === 'foster-yes';
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
          value: 'foster-yes',
        },
        {
          render: (props) => (
            <div>
              <RadioButton text="No" {...props} />
            </div>
          ),
          value: 'foster-no',
        },
        {
          render: (props) => (
            <div>
              <RadioButton text="Unknown/Not collected" {...props} />
            </div>
          ),
          value: 'foster-unknown',
        },
      ]}
      status={getValidationStatusForField}
    />
  </>
);
