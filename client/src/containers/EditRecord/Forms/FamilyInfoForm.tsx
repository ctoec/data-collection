import React, { useState, useContext } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Child, Family } from '../../../shared/models';
import { AddressFieldset } from './FormFields/AddressFieldset';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut, apiGet } from '../../../utils/api';

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
  passData: (_: Family) => void;
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
  passData,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [saving, setSaving] = useState(false);

  // Simple wrapper method that can be invoked via arrow function
  // in the callback series of .thens while handling the API
  // request. If the PUT update comes back with the family's 
  // correct ID number, that means we updated the DB successfully.
  function responseWrapper(newState: Family, code: number) {
    if (code == initState.id) {
      passData(newState);
    }
    else{
      console.error('Unable to update local state');
    }
  }

  // Sends an API request to the backend with any changed information
  // to the family's address. The backend handles the DB lookup,
  // then overwrites the information and persists it. The changed
  // result is handed back, and we update the local state to
  // display the change.
  function saveButton(newState: Family) {
    setSaving(true);
    apiPut(
      `families/${initState.id}`, newState, { accessToken })
      .then((responseCode) => responseWrapper(newState, responseCode))
      .then(() => alert('Data saved successfully!'))
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
        <AddressFieldset />
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
