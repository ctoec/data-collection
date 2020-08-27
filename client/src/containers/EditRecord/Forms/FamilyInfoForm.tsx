import React, { useState, useContext } from 'react';
import {
  Form,
  FormSubmitButton,
//   FormField,
//   CheckboxProps,
//   Checkbox,
} from '@ctoec/component-library';
import { Family } from '../../../shared/models';
import { AddressFieldset } from './FormFields/AddressFieldset';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../utils/api';

/*
Simple props type to hold the state passed in from the edit
record page and the state change function used to modify
the root variable. Note that we need to use the id of the
parent child object because it is unique in the backend
database, so this allows updating an existing record rather
than creating a new one or searching unsuccessfully.
*/
export type FamilyFormProps = {
  initState: Family;
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
  initState,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [saving, setSaving] = useState(false);

  // Simple wrapper method that can be invoked via arrow function
  // in the callback series of .thens while handling the API
  // request. If the PUT update comes back with the family's
  // correct ID number, that means we updated the DB successfully.
  function responseWrapper(code: number) {
    if (code == initState.id) {
      refetchChild();
    } else {
      console.error("Unable to refetch Child's record");
    }
  }

  // Sends an API request to the backend with any changed information
  // to the family's address. The backend handles the DB lookup,
  // then overwrites the information and persists it. The changed
  // result is handed back, and we update the local state to
  // display the change.
  function saveButton(newState: Family) {
    setSaving(true);
    apiPut(`families/${initState.id}`, newState, { accessToken })
      .then((_code) => {
        responseWrapper(_code);
      })
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
        data={initState}
        onSubmit={saveButton}
        noValidate
        autoComplete="off"
      >
        <h2 className="grid-row margin-top-4">Address</h2>
        <AddressFieldset />​
<!--         <div className="grid-row margin-top-4">
          <FormField<Family, CheckboxProps, boolean | null>
            id="homelessness"
            getValue={(data) => data.at('homelessness')}
            value={'homelessness'}
            parseOnChangeEvent={(e) => e.target.checked}
            inputComponent={Checkbox}
            text="Family has experienced homelessness / housing insecurity within the last year"
          />
        </div> -->
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
