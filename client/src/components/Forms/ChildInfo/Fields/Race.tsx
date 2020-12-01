import React, { useState } from 'react';
import { CheckboxGroup, CheckboxOptionInForm } from '@ctoec/component-library';
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

/**
 * Component for entering the race of a child in an enrollment.
 */
export const RaceField: React.FC = () => {
  const [notDisclosed, setNotDisclosed] = useState<boolean>();

  return (
    <CheckboxGroup<Child>
      inForm
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
const raceOptionFactory = (
  label: string,
  field: RaceField,
  notDisclosed: boolean | undefined,
  setNotDisclosed: any
): CheckboxOptionInForm<Child> => ({
  getValue: (data) => {
    return data.at(field);
  },
  parseOnChangeEvent: (e) => {
    setNotDisclosed(field === 'raceNotDisclosed' && e.target.checked);
    return e.target.checked;
  },
  id: field,
  text: label,
  disabled: field !== 'raceNotDisclosed' && notDisclosed,
  value: field,
});
