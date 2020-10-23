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

export const Foster: React.FC = () => (
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
    useFormFieldSet
    options={[
      {
        render: (props) => <RadioButton text="Yes" {...props} />,
        value: 'foster-yes',
      },
      {
        render: (props) => <RadioButton text="No" {...props} />,
        value: 'foster-no',
      },
      {
        render: (props) => <RadioButton text={UNKNOWN} {...props} />,
        value: 'foster-unknown',
      },
    ]}
    status={getValidationStatusForField}
  />
);
