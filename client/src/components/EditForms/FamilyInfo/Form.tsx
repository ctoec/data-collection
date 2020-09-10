import React, { useState, useContext } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Family } from '../../../shared/models';
import { AddressFieldset, HomelessnessField } from './Fields';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../utils/api';
import { EditFormProps } from '../types';
import useIsMounted from '../../../hooks/useIsMounted';

/*
 * Functional component that allows a user to modify the address
 * information of a family nested within a Child object. The
 * family data is manipulated directly to avoid interactions
 * with the Child object that the family form doesn't need
 * to know about.
 */
export const FamilyInfoForm: React.FC<EditFormProps> = ({
  child,
  onSuccess,
  hideHeader = false,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!child) return <></>;

  const { family } = child;

  const onSubmit = (newState: Family) => {
    setSaving(true);
    apiPut(`families/${family.id}`, newState, { accessToken })
      .then(onSuccess)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (isMounted() ? setSaving(false) : null));
  };

  return (
    <div className="grid-container margin-top-2">
      {!hideHeader && (
        <h2 className="grid-row">Family Address</h2>
      )}
      <Form<Family>
        className="FamilyInfoForm"
        data={family}
        onSubmit={onSubmit}
        noValidate
        autoComplete="off"
      >
        <AddressFieldset />
        <h3 className="grid-row margin-top-4">Experiencing homelessness</h3>
        <HomelessnessField />
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
