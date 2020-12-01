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
import { Child, RACE_FIELDS } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

// The fields we use to check to see if this form has errors or missing info
const specialCircumstancesFields = [
  'receivingDisabilityServices',
  'dualLanguageLearner',
  'foster',
];
export const childInfoFields = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
  'raceNotDisclosed',
  'hispanicOrLatinxEthnicity',
  'gender',
  ...specialCircumstancesFields,
];
export const doesChildInfoFormHaveErrors = (child?: Child) =>
  child ? !!getValidationStatusForFields(child, childInfoFields) : true;

export const ChildInfoForm = ({
  child,
  afterSaveSuccess,
  hideHeader = false,
  hideErrorsOnFirstLoad = false,
  showFieldOrFieldset = () => true,
  setAlerts,
}: RecordFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!child) {
    throw new Error('Child info rendered without child');
  }

  console.log(child)

  const { errorsHidden, setErrorsHidden } = useValidationErrors(
    hideErrorsOnFirstLoad
  );

  const onFinally = () => {
    if (isMounted()) {
      setErrorsHidden(false);
      setSaving(false);
    }
  };

  const onFormSubmit = (_child: Child) => {
    setSaving(true);
    apiPut(`children/${child.id}`, _child, { accessToken })
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save child info',
          },
        ]);
      })
      .finally(onFinally);
  };

  return (
    <Form<Child>
      className="ChildInfoForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
      hideStatus={errorsHidden}
    >
      {!hideHeader && <h2>Child info</h2>}
      {showFieldOrFieldset(child, [
        ...RACE_FIELDS,
        'hispanixOrLatinxEthnicity',
      ]) && (
          <>
            <RaceField />
            <EthnicityField />
          </>
        )}
      {showFieldOrFieldset(child, ['gender']) && <GenderField />}
      <br />

      {showFieldOrFieldset(child, specialCircumstancesFields) && (
        <h3 className="margin-bottom-0">Special circumstances</h3>
      )}
      {showFieldOrFieldset(child, ['receivesDisabilityServices']) && (
        <DisabilityServices />
      )}
      {showFieldOrFieldset(child, ['dualLanguageLearner']) && (
        <DualLanguageLearner />
      )}
      {showFieldOrFieldset(child, ['foster']) && <Foster />}
      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
