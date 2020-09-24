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
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

/**
 * Helper type of all valid race properties on Child
 */
type RaceField = Extract<
  keyof Child,
  | 'americanIndianOrAlaskaNative'
  | 'asian'
  | 'blackOrAfricanAmerican'
  | 'nativeHawaiianOrPacificIslander'
  | 'white'
>;

const raceOptions: { label: string; field: RaceField }[] = [
  {
    label: 'American Indian or Alaska Native',
    field: 'americanIndianOrAlaskaNative',
  },
  { label: 'Asian', field: 'asian' },
  {
    label: 'Black or African American',
    field: 'blackOrAfricanAmerican',
  },
  {
    label: 'Native Hawaiian or Pacific Islander',
    field: 'nativeHawaiianOrPacificIslander',
  },
  { label: 'White', field: 'white' },
];

/**
 * Component for entering the race of a child in an enrollment.
 */
export const RaceField: React.FC = () => {
  return (
    <CheckboxGroup<FormFieldSetProps<Child>>
      useFormFieldSet
      legend="Race"
      hint="As identified by family"
      showLegend
      id="race"
      options={raceOptions.map((o) => raceOptionFactory(o.label, o.field))}
      status={(data) =>
        getValidationStatusForFields(
          data,
          raceOptions.map((o) => o.field),
          { message: 'Child race is required' }
        )
      }
    />
  );
};

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
