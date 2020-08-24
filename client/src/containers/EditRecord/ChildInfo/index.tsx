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
  FosterCheckbox
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../utils/api';
import { Child } from '../../../shared/models';
// import { useFocusFirstError } from '../../../hooks/useFocusFirstError';

export default ({
  child,
  refetchChild,
}: {
  child: Child;
  refetchChild: () => void;
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [saving, setSaving] = useState(false);
  // TODO: HOW ARE WE HANDLING ERRORS?
  // const [error, setError] = useState(null);

  // Focus should automatically be on first error on page
  // useFocusFirstError([error]);

  const onFormSubmit = (_child: Child) => {
    setSaving(true);
    apiPut(`children/${child.id}`, _child, {
      accessToken,
      jsonParse: false
    })
      .then(refetchChild)
      .catch((err) => {
        // TODO: HOW ARE WE HANDLING ERRORS?  Do validation errors come back with the child?
        console.error(`There was an error saving child info: ${err}`);
      })
      .finally(() => setSaving(false));
  };

  if (!child) {
    throw new Error('Child info rendered without child');
  }

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
      <FormSubmitButton text={saving ? 'Saving...' : 'Save'} disabled={saving} />
    </Form>
  );
};
