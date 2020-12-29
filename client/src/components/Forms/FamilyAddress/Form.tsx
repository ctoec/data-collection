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
  child,
  afterSaveSuccess,
  hideHeader = false,
  hideErrors,
  setAlerts,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState<boolean>();

  if (!child) {
    throw new Error('Family info rendered without child');
  }

  const { family = {} as Family } = child;

  const { errorsHidden } = useValidationErrors(hideErrors);

  const onFinally = () => {
    if (isMounted()) {
      setSaving(false);
    }
  };

  const onSubmit = (newState: Family) => {
    setSaving(true);
    apiPut(`families/${family.id}`, newState, { accessToken })
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save family address',
          },
        ]);
      })
      .finally(onFinally);
  };

  console.log({ errorsHidden });

  return (
    <Form<Family>
      className="FamilyAddressForm"
      data={family}
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
      hideStatus={errorsHidden}
    >
      {!hideHeader && <h2 className="grid-row">Family Address</h2>}
      <AddressFieldset />
      <HomelessnessField />
      <div className="grid-row margin-top-2">
        <FormSubmitButton
          text={saving ? 'Saving...' : 'Save'}
          disabled={saving}
        />
      </div>
    </Form>
  );
};
