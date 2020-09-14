import React, { useContext, useEffect, useState } from 'react';
import {
  SasidField,
  FirstNameField,
  MiddleNameField,
  LastNameField,
  SuffixField,
  DateOfBirthField,
  BirthCertificateFormFieldSet,
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';

// import { useFocusFirstError } from '../../../hooks/useFocusFirstError';

export const ChildIdentifiersForm = ({
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
      className="ChildIdentifiersForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
    >
      {!hideHeader && (
        <>
          <h2>Child's identifiers</h2>
          <p className="usa-hint">
            Information is required unless otherwise specified.
          </p>
        </>
      )}
      <div className="grid-row grid-gap">
        <div className="mobile-lg:grid-col-12">
          <SasidField />
        </div>
        <div className="mobile-lg:grid-col-9">
          <FirstNameField />
        </div>
        <div className="mobile-lg:grid-col-9">
          <MiddleNameField />
        </div>
        <div className="display-flex flex-row flex-align-end grid-row grid-gap">
          <div className="mobile-lg:grid-col-9">
            <LastNameField />
          </div>
          <div className="mobile-lg:grid-col-3">
            <SuffixField />
          </div>
        </div>
      </div>
      <DateOfBirthField />
      <BirthCertificateFormFieldSet />
      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
