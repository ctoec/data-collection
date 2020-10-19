import React, { useContext, useState } from 'react';
import {
  RaceField,
  EthnicityField,
  GenderField,
  DisabilityServices,
  DualLanguageLearner,
  Foster,
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { RecordFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

// The fields we use to check to see if this form has errors or missing info
export const childInfoFields = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
  'raceNotDisclosed',
  'hispanicOrLatinxEthnicity',
  'gender',
  'receivingDisabilityServices',
  'dualLanguageLearner',
  'foster',
];
export const doesChildInfoFormHaveErrors = (child?: Child) =>
  child ? !!getValidationStatusForFields(child, childInfoFields) : true;

export const ChildInfoForm = ({
  child: inputChild,
  afterSaveSuccess,
  hideHeader = false,
  hideErrorsOnFirstLoad = false,
}: RecordFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

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
      .then(afterSaveSuccess)
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
      {!hideHeader && <h2>Child info</h2>}
      <RaceField />
      <EthnicityField />
      <GenderField />

      <br />
      <h3 className="margin-bottom-0">Special circumstances</h3>
      <DisabilityServices />
      <DualLanguageLearner />
      <Foster />

      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
