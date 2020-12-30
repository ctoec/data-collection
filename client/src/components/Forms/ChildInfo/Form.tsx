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
import { getNextHeadingLevel, Heading } from '../../Heading';

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
  hideErrors,
  showFieldOrFieldset = () => true,
  setAlerts,
  topHeadingLevel,
}: RecordFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!child) {
    throw new Error('Child info rendered without child');
  }

  const { errorsHidden } = useValidationErrors(hideErrors);

  const onFinally = () => {
    if (isMounted()) {
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
      {!hideHeader && <Heading level={topHeadingLevel}>Child info</Heading>}
      {showFieldOrFieldset(child, [
        ...RACE_FIELDS,
        'hispanicOrLatinxEthnicity',
      ]) && (
        <>
          <RaceField />
          <EthnicityField />
        </>
      )}
      {showFieldOrFieldset(child, ['gender']) && <GenderField />}
      <br />

      {showFieldOrFieldset(child, specialCircumstancesFields) && (
        <Heading
          level={getNextHeadingLevel(topHeadingLevel)}
          className="margin-bottom-0"
        >
          Special circumstances
        </Heading>
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
