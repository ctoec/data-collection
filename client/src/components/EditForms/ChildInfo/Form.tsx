import React, { useContext, useState, useEffect } from 'react';
import {
  RaceField,
  EthnicityField,
  GenderField,
  FosterCheckbox,
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';

// import { useFocusFirstError } from '../../../hooks/useFocusFirstError';

export const ChildInfoForm = ({
  child,
  onSuccess,
  setAlerts,
  hideHeader = false,
}: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);
  // TODO: HOW ARE WE HANDLING ERRORS?
  // const [error, setError] = useState(null);

  // Focus should automatically be on first error on page
  // useFocusFirstError([error]);

  // Clear any previously displayed alerts from other tabs
  useEffect(() => {
    setAlerts([]);
  }, []);

  if (!child) {
    throw new Error('Child info rendered without child');
  }

  const onFormSubmit = (_child: Child) => {
    setSaving(true);
    apiPut(`children/${child.id}`, _child, { accessToken })
      .then(() => onSuccess())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (isMounted() ? setSaving(false) : null));
  };

  return (
    <Form<Child>
      className="ChildInfoForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
    >
      {!hideHeader && (
        <>
          <h2>Child info</h2>
          <p className="usa-hint">
            Information is required unless otherwise specified.
          </p>
        </>
      )}
      <RaceField />
      <EthnicityField />
      <GenderField />
      <FosterCheckbox />
      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
