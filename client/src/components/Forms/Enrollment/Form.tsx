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
import { RecordFormProps } from '../types';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { getCurrentEnrollment } from '../../../utils/models';
import { apiPost, apiPut } from '../../../utils/api';

const enrollmentFields = ['site', 'ageGroup', 'entry', 'model'];
const enrollmentFundingFields = [...enrollmentFields, 'funding'];
export const doesEnrollmentFormHaveErrors = (
  child?: Child,
  enrollmentId?: number,
  opts: { excludeFundings?: boolean } = {}
) => {
  if (enrollmentId) {
    const enrollment = child?.enrollments?.find((e) => e.id === enrollmentId);
    return enrollment
      ? !!getValidationStatusForFields(
          enrollment,
          opts.excludeFundings ? enrollmentFields : enrollmentFundingFields
        )
      : false;
  }

  return child?.enrollments?.length
    ? !!getValidationStatusForFields(child.enrollments, enrollmentFundingFields)
    : true;
};

type EnrollmentFormProps = {
  id?: string;
  enrollmentId?: number;
} & RecordFormProps;

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  id,
  child,
  enrollmentId,
  AdditionalButton,
  afterSaveSuccess,
  setAlerts,
  showFieldOrFieldset = () => true,
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
      data={enrollment}
      onSubmit={onSubmit}
    >
      {showFieldOrFieldset(enrollment, ['site']) && (
        <SiteField<Enrollment>
          sites={sites.filter(
            (s) => s.organizationId === child.organization.id
          )}
        />
      )}
      {showFieldOrFieldset(enrollment, ['entry', 'model']) && (
        <>
          <EnrollmentStartDateField<Enrollment> />
          <CareModelField<Enrollment> />
        </>
      )}
      {showFieldOrFieldset(enrollment, ['ageGroup']) && (
        <AgeGroupField<Enrollment> />
      )}
      {showFieldOrFieldset(enrollment, ['fundings']) && (
        <NewFundingField<Enrollment>
          fundingAccessor={(data) => data.at('fundings').at(0)}
          getEnrollment={(data) => data.value}
          orgId={child.organization.id}
        />
      )}
      {AdditionalButton}
      <FormSubmitButton
        text={loading ? 'Saving...' : 'Save'}
        disabled={loading}
      />
    </Form>
  );
};
