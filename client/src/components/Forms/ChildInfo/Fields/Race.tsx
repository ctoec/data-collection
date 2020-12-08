import React, { useState } from 'react';
import {
  useGenericContext,
  FormContext,
  Checkbox,
  FormFieldSet,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { set } from 'lodash';

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

type RaceFieldProps = {
  child: Child;
};

/**
 * Component for entering the race of a child in an enrollment.
 * Need to use a FormFieldSet that contains checkboxes based
 * on a state variable instead of having a group of checkboxes,
 * because we want the value of one of the checkboxes to control
 * the state and checked status of other checkboxes. See BirthState
 * and BirthTown form fields for a similar data pattern. An
 * accessor is still used for safely manipulating each field in
 * the child object.
 */
export const RaceField: React.FC<RaceFieldProps> = ({ child }) => {
  const [notDisclosed, setNotDisclosed] = useState<boolean>();
  const { dataDriller, updateData } = useGenericContext<Child>(FormContext);

  return (
    <FormFieldSet<Child>
      legend="Race"
      hint="As identified by family"
      showLegend
      id="race"
      status={(data) =>
        getValidationStatusForFields(
          data,
          raceOptions.map((o) => o.field),
          { message: 'Race is required for OEC reporting.' }
        )
      }
    >
      {raceOptions.map((o) =>
        raceOptionFactory(
          child,
          o.label,
          o.field,
          notDisclosed,
          setNotDisclosed,
          dataDriller,
          updateData
        )
      )}
    </FormFieldSet>
  );
};

/**
 *
 * @param label The text for the Checkbox to display
 * @param field The property name on Child of the race
 */
const raceOptionFactory = (
  child: Child,
  label: string,
  field: RaceField,
  notDisclosed: boolean | undefined,
  setNotDisclosed: any,
  dataDriller: any,
  updateData: any
) => {
  return (
    <Checkbox
      id={field}
      text={label}
      onChange={(e) => {
        if (field === 'raceNotDisclosed') {
          setNotDisclosed(e.target.checked);
          raceOptions.forEach((o) => {
            if (o.field !== 'raceNotDisclosed') {
              updateData(
                set(
                  child,
                  dataDriller.at(o.field).path,
                  e.target.checked ? false : null
                )
              );
            } else {
              updateData(
                set(child, dataDriller.at(o.field).path, e.target.checked)
              );
            }
          });
        } else {
          updateData(set(child, dataDriller.at(field).path, e.target.checked));
        }
      }}
      disabled={field !== 'raceNotDisclosed' && notDisclosed}
      value={field}
      checked={dataDriller.at(field).value}
    />
  );
};
