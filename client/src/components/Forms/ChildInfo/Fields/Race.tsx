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
import produce from 'immer';

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
 * Need to use a FormFieldSet that contains checkboxes based
 * on a state variable instead of having a group of checkboxes,
 * because we want the value of one of the checkboxes to control
 * the state and checked status of other checkboxes. See BirthState
 * and BirthTown form fields for a similar data pattern. An
 * accessor is still used for safely manipulating each field in
 * the child object.
 */
export const RaceField: React.FC = () => {
  const { data: child, dataDriller, updateData } = useGenericContext<Child>(
    FormContext
  );
  const [notDisclosed, setNotDisclosed] = useState<boolean>(
    dataDriller.at('raceNotDisclosed').value
  );

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
        const checked = e.target.checked;
        if (field === 'raceNotDisclosed') {
          setNotDisclosed(checked);
          // Bulk update all non-disclosed race fields
          const updateChild = produce<Child>(child, (draft) => {
            raceOptions.forEach((o) => {
              if (o.field !== 'raceNotDisclosed') {
                set(draft, dataDriller.at(o.field).path, false);
              } else {
                set(draft, dataDriller.at(o.field).path, checked);
              }
            });
            return draft;
          });
          updateData(updateChild);
        } else {
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, dataDriller.at(field).path, checked)
            )
          );
        }
      }}
      disabled={field !== 'raceNotDisclosed' && notDisclosed}
      value={field}
      checked={dataDriller.at(field).value}
    />
  );
};
