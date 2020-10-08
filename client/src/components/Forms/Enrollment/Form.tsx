import React, { useContext, useState } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Enrollment, Child } from '../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  CareModelField,
  AgeGroupField,
  NewFundingField,
} from './Fields';
import UserContext from '../../../contexts/UserContext/UserContext';
import { EditFormProps } from '../types';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { getCurrentEnrollment } from '../../../utils/models';
import { apiPost, apiPut } from '../../../utils/api';

const enrollmentFields = ['site', 'ageGroup', 'entry', 'model', 'fundings'];
export const doesEnrollmentFormHaveErrors = (
  child?: Child,
  enrollmentId?: number
) => {
  if (enrollmentId) {
    const enrollment = child?.enrollments?.find((e) => e.id === enrollmentId);
    return enrollment
      ? !!getValidationStatusForFields(
          enrollment,
          enrollmentFields.filter((field) => field !== 'fundings')
        )
      : false;
  }

  return child?.enrollments?.length
    ? !!getValidationStatusForFields(child.enrollments, enrollmentFields)
    : true;
};

type EnrollmentFormProps = {
  id?: string;
  enrollmentId?: number;
  submitButtonText?: string;
  CancelButton?: JSX.Element;
} & EditFormProps;

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  id,
  child,
  enrollmentId,
  submitButtonText = 'Save',
  CancelButton,
  afterSaveSuccess,
  setAlerts,
  showField = () => true,
}) => {
  if (!child) {
    throw new Error('Enrollment form rendered without child');
  }

  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);

  const { user } = useContext(UserContext);
  const sites = user?.sites || [];

  const enrollment =
    (enrollmentId
      ? child.enrollments?.find((e) => e.id === enrollmentId)
      : getCurrentEnrollment(child)) || ({} as Enrollment);

  const createEnrollment = async (updatedData: Enrollment) =>
    apiPost(
      `children/${child.id}/change-enrollment`,
      { newEnrollment: updatedData },
      { accessToken, jsonParse: false }
    );

  const updateEnrollment = async (updatedData: Enrollment) =>
    apiPut(`enrollments/${enrollment.id}`, updatedData, {
      accessToken,
    });

  const saveData = enrollment.id ? updateEnrollment : createEnrollment;
  const onSubmit = (updatedData: Enrollment) => {
    setLoading(true);
    saveData(updatedData)
      .then(afterSaveSuccess)
      .catch((err) => {
        console.log(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save enrollment',
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form<Enrollment>
      id={id || `edit-enrollment-form-${enrollment.id}`}
      className="usa-form"
      data={enrollment}
      onSubmit={onSubmit}
    >
      {showField(enrollment, ['site'], enrollmentFields) && (
        <SiteField<Enrollment> sites={sites} />
      )}
      {showField(enrollment, ['entry'], enrollmentFields) && (
        <EnrollmentStartDateField<Enrollment> />
      )}
      {showField(enrollment, ['model'], enrollmentFields) && (
        <CareModelField<Enrollment> />
      )}
      {showField(enrollment, ['ageGroup'], enrollmentFields) && (
        <AgeGroupField<Enrollment> />
      )}
      {showField(enrollment, ['fundings'], enrollmentFields) && (
        <NewFundingField<Enrollment>
          fundingAccessor={(data) => data.at('fundings').at(0)}
          getEnrollment={(data) => data.value}
        />
      )}
      {CancelButton}
      <FormSubmitButton
        text={loading ? 'Saving...' : submitButtonText}
        disabled={loading}
      />
    </Form>
  );
};
