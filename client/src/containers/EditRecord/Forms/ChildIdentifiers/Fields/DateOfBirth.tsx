import React from 'react';
import { FormField, DateInputProps, DateInput } from '@ctoec/component-library';
import { Child } from '../../../../../shared/models';
import { Moment } from 'moment';

/**
 * Component for entering the birth date of a child in an enrollment.
 */
export const DateOfBirthField: React.FC = () => {
  return (
    <FormField<Child, DateInputProps, Moment | null>
      getValue={(data) => data.at('birthdate')}
      parseOnChangeEvent={(e) => (e as unknown) as Moment}
      inputComponent={DateInput}
      id="dateOfBirth-picker"
      label="Birth date"
    />
  );
};
