import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';
import { UNKNOWN } from '../../../../shared/constants';

export const DisabilityServices: React.FC = () => (
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
    useFormFieldSet
    options={[
      {
        render: (props) => (
          <RadioButton text="Receives disability services" {...props} />
        ),
        value: 'disability-yes',
      },
      {
        render: (props) => (
          <RadioButton text="Does not receive disability services" {...props} />
        ),
        value: 'disability-no',
      },
      {
        render: (props) => <RadioButton text={UNKNOWN} {...props} />,
        value: 'disability-unknown',
      },
    ]}
    status={getValidationStatusForField}
  />
);
