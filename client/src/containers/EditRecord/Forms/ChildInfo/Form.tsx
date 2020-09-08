import React, { useContext, useState } from 'react';
import {
  SasidField,
  FirstNameField,
  MiddleNameField,
  LastNameField,
  SuffixField,
  DateOfBirthField,
  BirthCertificateFormFieldSet,
  RaceField,
  EthnicityField,
  GenderField,
  FosterCheckbox,
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../../shared/models';
import { apiPut } from '../../../../utils/api';
import useIsMounted from '../../../../hooks/useIsMounted';

// import { useFocusFirstError } from '../../../hooks/useFocusFirstError';

export const ChildInfoForm = ({ child, onSuccess }: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);
  // TODO: HOW ARE WE HANDLING ERRORS?
  // const [error, setError] = useState(null);

  // Focus should automatically be on first error on page
  // useFocusFirstError([error]);

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
      <h2>Date of birth</h2>
      <DateOfBirthField />
      <h2>Birth certificate</h2>
      <BirthCertificateFormFieldSet />
      <h2>Race</h2>
      <RaceField />
      <h2>Ethnicity</h2>
      <EthnicityField />
      <h2>Gender</h2>
      <GenderField />
      <h2>Foster</h2>
      <FosterCheckbox />
      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
