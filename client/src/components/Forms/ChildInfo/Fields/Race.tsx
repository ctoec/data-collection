import React, { useState } from 'react';
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
  | 'raceNotDisclosed'
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
  {
    label: 'Race Not Disclosed',
    field: 'raceNotDisclosed',
  },
];

const raceIndicated = (record: any) => {
  return (
    !!record.at('americanIndianOrAlaskaNative') ||
    !!record.at('asian') ||
    !!record.at('blackOrAfricanAmerican') ||
    !!record.at('nativeHawaiianOrPacificIslander') ||
    !!record.at('white')
  );
};

/**
 * Component for entering the race of a child in an enrollment.
 */
export const RaceField: React.FC = () => {
  const [notDisclosed, setNotDisclosed] = useState(true);

  return (
    <CheckboxGroup<FormFieldSetProps<Child>>
      useFormFieldSet
      legend="Race"
      hint="As identified by family"
      showLegend
      id="race"
      options={raceOptions.map((o) =>
        raceOptionFactory(o.label, o.field, notDisclosed, setNotDisclosed)
      )}
      status={(data) =>
        getValidationStatusForFields(
          data,
          raceOptions.map((o) => o.field),
          { message: 'Race is required for OEC reporting.' }
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
const raceOptionFactory: (
  label: string,
  field: RaceField,
  notDisclosed: boolean,
  setNotDisclosed: any
) => CheckboxOption = (label, field, notDisclosed, setNotDisclosed) => ({
  render: ({ id, selected }) => (
    <FormField<Child, CheckboxProps, boolean>
      getValue={(data) => {
        return data.at(field);
      }}
      preprocessForDisplay={(data) => {
        if (field === 'raceNotDisclosed') setNotDisclosed(data);
        return data;
      }}
      parseOnChangeEvent={(e) => {
        setNotDisclosed(field === 'raceNotDisclosed' && e.target.checked);
        return e.target.checked;
      }}
      defaultValue={selected}
      inputComponent={Checkbox}
      id={id}
      text={label}
      disabled={field !== 'raceNotDisclosed' && notDisclosed}
    />
  ),
  value: field,
});
