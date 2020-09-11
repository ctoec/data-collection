import React from 'react';
import {
  CheckboxGroup,
  FormFieldSetProps,
  CheckboxOption,
  FormField,
  CheckboxProps,
  Checkbox,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

/**
 * Component for entering the race of a child in an enrollment.
 */
export const RaceField: React.FC = () => {
  return (
    <CheckboxGroup<FormFieldSetProps<Child>>
      useFormFieldSet
      legend="Race"
      showLegend
      id="race"
      options={[
        raceOptionFactory(
          'American Indian or Alaska Native',
          'americanIndianOrAlaskaNative'
        ),
        raceOptionFactory('Asian', 'asian'),
        raceOptionFactory(
          'Black or African American',
          'blackOrAfricanAmerican'
        ),
        raceOptionFactory(
          'Native Hawaiian or Pacific Islander',
          'nativeHawaiianOrPacificIslander'
        ),
        raceOptionFactory('White', 'white'),
      ]}
    />
  );
};

/**
 * Helper type of all valid race properties on Child
 */
type RaceField =
  | 'americanIndianOrAlaskaNative'
  | 'asian'
  | 'blackOrAfricanAmerican'
  | 'nativeHawaiianOrPacificIslander'
  | 'white';

/**
 *
 * @param label The text for the Checkbox to display
 * @param field The property name on Child of the race
 */
const raceOptionFactory: (label: string, field: RaceField) => CheckboxOption = (
  label,
  field
) => ({
  render: ({ id, selected }) => (
    <FormField<Child, CheckboxProps, boolean>
      getValue={(data) => data.at(field)}
      parseOnChangeEvent={(e) => e.target.checked}
      defaultValue={selected}
      inputComponent={Checkbox}
      id={id}
      text={label}
    />
  ),
  value: field,
});
