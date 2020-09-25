import React, { useState, useContext } from 'react';
import { CareForKidsField } from './CareForKidsField';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';

// The fields we use to check to see if this form has errors or missing info
const c4kFormFields = ['receivesC4K'];
export const doesC4kFormHaveErrors = (child: Child) =>
  !!getValidationStatusForFields(child, c4kFormFields);
/*
 * Basic functional component designed to allow user to edit
 * the Care For Kids field of a Child object.
 */
export const CareForKidsForm: React.FC<EditFormProps> = ({
  child,
  afterDataSave,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [isSaving, setIsSaving] = useState(false);

  if (!child) return <></>;

  const onSubmit = (updatedChild: Child) => {
    setIsSaving(true);
    apiPut(`children/${child.id}`, updatedChild, { accessToken })
      .then(() => afterDataSave())
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
