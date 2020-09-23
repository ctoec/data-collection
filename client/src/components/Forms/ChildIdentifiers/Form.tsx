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
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

// The fields we use to check to see if this form has errors or missing info
const childIdentifiersFields = ['sasid', 'firstName', 'middleName', 'lastName', 'suffix', 'birthdate', 'birthTown', 'birthState', 'birthCertificateId']
export const doesChildIdFormHaveErrors = (child: Child) => !!getValidationStatusForFields(child, childIdentifiersFields)

export const ChildIdentifiersForm = ({
  child: inputChild,
  onSuccess,
  setAlerts,
  hideHeader = false,
  hideErrorsOnFirstLoad,
}: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  // Clear any previously displayed alerts from other tabs
  useEffect(() => {
    setAlerts([]);
  }, []);

  if (!inputChild) {
    throw new Error('Child info rendered without child');
  }

  const { obj: child, setErrorsHidden } = useValidationErrors<Child>(
    inputChild,
    hideErrorsOnFirstLoad
  );

  const onFormSubmit = (_child: Child) => {
    setErrorsHidden(false);
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
      {!hideHeader && <h2>Child's identifiers</h2>}
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
