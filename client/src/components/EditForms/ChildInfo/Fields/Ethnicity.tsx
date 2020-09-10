import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

/**
 * Component for entering the enthicity of a child in an enrollment.
 *
 * The internal controlling component, RadioButtonGroup, wraps the individual
 * RadioButtons in a fieldset.
 */
export const EthnicityField: React.FC = () => {
  return (
    <FormField<Child, RadioButtonGroupProps, boolean | null>
      getValue={(data) => data.at('hispanicOrLatinxEthnicity')}
      preprocessForDisplay={(data) =>
        // eslint-disable-next-line
        data == undefined // check for both null and undefined
          ? undefined
          : data
          ? 'yes'
          : 'no'
      }
      parseOnChangeEvent={(e) => e.target.value === 'yes'}
      inputComponent={RadioButtonGroup}
      id="ethnicity-radiogroup"
      name="ethnicity"
      legend="Ethnicity"
      showLegend
      hint="As identified by family"
      options={[
        {
          render: (props) => (
            <RadioButton text="Not Hispanic or Latinx" {...props} />
          ),
          value: 'no',
        },
        {
          render: (props) => (
            <RadioButton text="Hispanic or Latinx" {...props} />
          ),
          value: 'yes',
        },
      ]}
    />
  );
};
