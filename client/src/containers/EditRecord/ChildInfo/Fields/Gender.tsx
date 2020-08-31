import React from 'react';
import { FormField, SelectProps, Select } from '@ctoec/component-library';
import { Child, Gender } from '../../../../shared/models';

/**
 * Component for entering the gender of a child in an enrollment.
 */
export const GenderField: React.FC = () => {
  return (
    <FormField<Child, SelectProps, Gender>
      getValue={(data) => data.at('gender')}
      // Gender will always be defined, so the cast will always succeed
      preprocessForDisplay={(data) => data}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={Select}
      id="gender-select"
      label="Gender"
      hint="As identified by family"
      options={[
        {
          value: Gender.Female,
          text: Gender.Female,
        },
        {
          value: Gender.Male,
          text: Gender.Male,
        },
        {
          value: Gender.Nonbinary,
          text: Gender.Nonbinary,
        },
        {
          value: Gender.Unknown,
          text: Gender.Unknown,
        },
      ]}
    />
  );
};
