import React, { useState, useContext } from 'react';
import {
  Form,
  FormSubmitButton,
  FormField,
  CheckboxProps,
  Checkbox,
} from '@ctoec/component-library';
import { Family } from '../../../shared/models';
import { AddressFieldset } from './FormFields/AddressFieldset';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../utils/api';

/*
Simple props type to hold the family associated with the particular
child record being examined, as well as the refetch method that 
lets us get the updated DB record once we make changes.
*/
export type FamilyFormProps = {
  family: Family;
  refetchChild: () => void;
};

/*
 * Functional component that allows a user to modify the address
 * information of a family nested within a Child object. The
 * family data is manipulated directly to avoid interactions
 * with the Child object that the family form doesn't need
 * to know about.
 */
export const FamilyInfoForm: React.FC<FamilyFormProps> = ({
  family,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [saving, setSaving] = useState(false);

  // Sends an API request to the backend with any changed information
  // to the family's address. The backend handles the DB lookup,
  // then overwrites the information and persists it. The changed
  // result is handed back, and we update the local state to
  // display the change.
  function saveButton(newState: Family) {
    setSaving(true);
    apiPut(`families/${family.id}`, newState, { accessToken })
      .then(() => refetchChild())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setSaving(false));
  }

  return (
    <div className="grid-container margin-top-2">
      <h1 className="grid-row">Family Address</h1>
      <div className="grid-row margin-top-2 text-light">
        Information is required unless otherwise specified.
      </div>

      <Form<Family>
        className="FamilyInfoForm"
        data={family}
        onSubmit={saveButton}
        noValidate
        autoComplete="off"
      >
        <h2 className="grid-row margin-top-4">Address</h2>
        <AddressFieldset />​
        <div className="grid-row margin-top-4">
          <FormField<Family, CheckboxProps, boolean | null>
            id="homelessness"
            getValue={(data) => data.at('homelessness')}
            value={'homelessness'}
            parseOnChangeEvent={(e) => e.target.checked}
            inputComponent={Checkbox}
            text="Family has experienced homelessness / housing insecurity within the last year"
          />
        </div>
        <div className="grid-row margin-top-2">
          <FormSubmitButton
            text={saving ? 'Saving...' : 'Save edits'}
            disabled={saving}
          />
        </div>
      </Form>
    </div>
  );
};
