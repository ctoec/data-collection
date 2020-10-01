import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

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
      preprocessForDisplay={(data) => {
        if (data === true) return 'Yes';
        else if (data === false) return 'No';
        else return 'Unknown';
      }}
      parseOnChangeEvent={(e) => {
        if (e.target.value !== 'Unknown') return e.target.value === 'Yes';
        else return null;
      }}
      inputComponent={RadioButtonGroup}
      id="ethnicity-radiogroup"
      name="ethnicity"
      legend="Ethnicity"
      showLegend
      hint="As identified by family"
      options={[
        {
          render: (props) => (
            <RadioButton text="Hispanic or Latinx" {...props} />
          ),
          value: 'Yes',
        },
        {
          render: (props) => (
            <RadioButton text="Not Hispanic or Latinx" {...props} />
          ),
          value: 'No',
        },
        {
          render: (props) => (
            <RadioButton text="Unknown/Not Collected" {...props} />
          ),
          value: 'Unknown',
        },
      ]}
      status={getValidationStatusForField}
    />
  );
};
