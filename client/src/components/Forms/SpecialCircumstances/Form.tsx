import React, { useContext, useState } from 'react';
import { DualLanguageLearner, Foster, DisabilityServices } from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

// The fields we use to check to see if this form has errors or missing info
export const specialCircumstancesFields = [
  'receivesDisabilityServices',
  'dualLanguageLearner',
  'foster',
];
export const doesSpecialCircumstancesFormHaveErrors = (child?: Child) =>
  child
    ? !!getValidationStatusForFields(child, specialCircumstancesFields)
    : true;

export const SpecialCircumstancesForm = ({
  child: inputChild,
  afterDataSave,
  hideHeader = false,
  hideErrorsOnFirstLoad = false,
}: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!inputChild) {
    throw new Error('Special circumstances rendered without child');
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

  return (
    <Form<Child>
      className="SpecialCircumstancesForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
    >
      {!hideHeader && <h2>Special circumstances</h2>}
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
