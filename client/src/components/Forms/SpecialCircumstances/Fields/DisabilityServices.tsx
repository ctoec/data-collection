import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

export const DisabilityServices: React.FC = () => (
  <>
    <FormField<Child, RadioButtonGroupProps, boolean | null>
      id="disability-button-group"
      getValue={(data) => data.at('receivesDisabilityServices')}
      preprocessForDisplay={(data) => {
        if (data === true) return 'disability-yes';
        else if (data === false) return 'disability-no';
        else return 'disability-unknown';
      }}
      parseOnChangeEvent={(e) => {
        if (e.target.value !== 'disability-unknown')
          return e.target.value === 'disability-yes';
        else return null;
      }}
      inputComponent={RadioButtonGroup}
      name="disability"
      legend="Receiving disability services"
      showLegend
      options={[
        {
          render: (props) => (
            <div>
              <RadioButton text="Receives disability services" {...props} />
            </div>
          ),
          value: 'disability-yes',
        },
        {
          render: (props) => (
            <div>
              <RadioButton
                text="Does not receive disability services"
                {...props}
              />
            </div>
          ),
          value: 'disability-no',
        },
        {
          render: (props) => (
            <div>
              <RadioButton text="Unknown/Not collected" {...props} />
            </div>
          ),
          value: 'disability-unknown',
        },
      ]}
      status={getValidationStatusForField}
    />
  </>
);
