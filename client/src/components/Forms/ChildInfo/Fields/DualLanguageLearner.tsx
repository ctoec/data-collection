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

export const DualLanguageLearner: React.FC = () => (
  <FormField<Child, RadioButtonGroupProps, boolean | null>
    id="duallanguage-button-group"
    getValue={(data) => data.at('dualLanguageLearner')}
    preprocessForDisplay={(data) => {
      if (data === true) return 'dual-yes';
      else if (data === false) return 'dual-no';
      else return 'dual-unknown';
    }}
    parseOnChangeEvent={(e) => {
      if (e.target.value !== 'dual-unknown')
        return e.target.value === 'dual-yes';
      else return null;
    }}
    inputComponent={RadioButtonGroup}
    name="dualLanguageLearner"
    legend="Dual Language Learner"
    showLegend
    useFormFieldSet
    options={[
      {
        render: (props) => (
          <div>
            <RadioButton text="Is a dual language learner" {...props} />
          </div>
        ),
        value: 'dual-yes',
      },
      {
        render: (props) => (
          <div>
            <RadioButton text="Is not a dual language learner" {...props} />
          </div>
        ),
        value: 'dual-no',
      },
      {
        render: (props) => (
          <div>
            <RadioButton text={UNKNOWN} {...props} />
          </div>
        ),
        value: 'dual-unknown',
      },
    ]}
    status={getValidationStatusForField}
  />
);
