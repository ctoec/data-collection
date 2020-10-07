import React, { useContext, useState } from 'react';
import {
  RaceField,
  EthnicityField,
  GenderField,
  DisabilityServices,
  DualLanguageLearner,
  Foster,
} from './Fields';
import { Form, FormSubmitButton, Button } from '@ctoec/component-library';
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
  record: inputChild,
  afterDataSave,
  hideHeader = false,
  hideErrorsOnFirstLoad = false,
  batchEditProps = {
    showField: () => true,
    SkipButton: <></>,
  },
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
      .then(afterDataSave)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (isMounted() ? setSaving(false) : null));
  };

  const { showField, SkipButton } = batchEditProps;
  return (
    <Form<Child>
      className="ChildInfoForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
    >
      {!hideHeader && <h2>Child info</h2>}
      {showField(
        [
          'americanIndianOrAlaskaNative',
          'asian',
          'blackOrAfricanAmerican',
          'nativeHawaiianOrPacificIslander',
          'white',
          'raceNotDisclosed',
        ],
        childInfoFields,
        child
      ) && <RaceField />}
      {showField('hispanicOrLatinxEthnicity', childInfoFields, child) && (
        <EthnicityField />
      )}
      {showField('gender', childInfoFields, child) && <GenderField />}

      <br />
      <h3 className="margin-bottom-0">Special circumstances</h3>
      {showField('receivingDisabilityServices', childInfoFields, child) && (
        <DisabilityServices />
      )}
      {showField('dualLanguageLearner', childInfoFields, child) && (
        <DualLanguageLearner />
      )}
      {showField('foster', childInfoFields, child) && <Foster />}

      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
      {SkipButton}
    </Form>
  );
};
