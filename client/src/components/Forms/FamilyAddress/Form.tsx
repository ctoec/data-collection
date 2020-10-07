import React, { useState, useContext } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Child, Family } from '../../../shared/models';
import { AddressFieldset, HomelessnessField } from './Fields';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../utils/api';
import { RecordFormProps } from '../types';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

const familyAddressFields = [
  'streetAddress',
  'town',
  'state',
  'zipCode',
  'homelessness',
];
export const doesFamilyAddressFormHaveErrors = (child?: Child) =>
  child?.family
    ? !!getValidationStatusForFields(child.family, familyAddressFields)
    : true;

/*
 * Functional component that allows a user to modify the address
 * information of a family nested within a Child object. The
 * family data is manipulated directly to avoid interactions
 * with the Child object that the family form doesn't need
 * to know about.
 */
export const FamilyAddressForm: React.FC<RecordFormProps> = ({
  record: child,
  afterDataSave,
  hideHeader = false,
  hideErrorsOnFirstLoad = false,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!child) {
    throw new Error('Family info rendered without child');
  }

  const { family: inputFamily = {} as Family } = child;

  const { obj: family, setErrorsHidden } = useValidationErrors<Family>(
    inputFamily,
    hideErrorsOnFirstLoad
  );

  const onSubmit = (newState: Family) => {
    setErrorsHidden(false);
    setSaving(true);
    apiPut(`families/${family.id}`, newState, { accessToken })
      .then(afterDataSave)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (isMounted() ? setSaving(false) : null));
  };

  return (
    <div className="grid-container margin-top-2">
      {!hideHeader && <h2 className="grid-row">Family Address</h2>}
      <Form<Family>
        className="FamilyAddressForm"
        data={family}
        onSubmit={onSubmit}
        noValidate
        autoComplete="off"
      >
        <AddressFieldset />
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
