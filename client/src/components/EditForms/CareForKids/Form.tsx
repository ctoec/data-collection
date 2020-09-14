import { CareForKidsField } from './CareForKidsField';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  FormSubmitButton,
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
/*
 * Basic functional component designed to allow user to edit
 * the Care For Kids field of a Child object.
 */
export const CareForKidsForm: React.FC<EditFormProps> = ({
  child,
  onSuccess,
  setAlerts,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [isSaving, setIsSaving] = useState(false);

  // Clear any previously displayed alerts from other tabs
  useEffect(() => {
    setAlerts([]);
  }, []);

  if (!child) return <></>;

  const onSubmit = (updatedChild: Child) => {
    setIsSaving(true);
    apiPut(`children/${child.id}`, updatedChild, { accessToken })
      .then(() => onSuccess())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="grid-container margin-top-2">
      <h2 className="grid-row">Care 4 Kids</h2>
      <div>
        <Form<Child>
          className="CareForKidsForm"
          data={child}
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
        >
          <CareForKidsField />
          <div className="grid-row margin-top-2">
            <FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} />
          </div>
        </Form>
      </div>
    </div>
  );
};
