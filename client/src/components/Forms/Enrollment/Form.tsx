import React, { useContext, useState } from 'react';
import { Alert, Form, FormSubmitButton } from '@ctoec/component-library';
import { Enrollment, Child } from '../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  CareModelField,
  AgeGroupField,
  NewFundingField,
  EnrollmentEndDateField,
  ExitReasonField,
} from './Fields';
import UserContext from '../../../contexts/UserContext/UserContext';
import { RecordFormProps } from '../types';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { getCurrentEnrollment } from '../../../utils/models';
import { apiPost, apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';

const enrollmentFields = ['site', 'ageGroup', 'entry', 'model'];
const enrollmentFundingFields = [...enrollmentFields, 'fundings'];
export const doesEnrollmentFormHaveErrors = (
  child?: Child,
  enrollmentId?: number,
  opts: { excludeFundings?: boolean } = {}
) => {
  if (enrollmentId) {
    const enrollment = child?.enrollments?.find((e) => e.id === enrollmentId);
    if (!opts.excludeFundings && enrollment && !enrollment.fundings?.length)
      return true;
    return enrollment
      ? !!getValidationStatusForFields(
          enrollment,
          opts.excludeFundings ? enrollmentFields : enrollmentFundingFields
        )
      : false;
  }

  if (child && !!getValidationStatusForFields(child, ['enrollments'])) {
    return true;
  }

  return child?.enrollments?.length
    ? !!getValidationStatusForFields(child.enrollments, enrollmentFundingFields)
    : true;
};

type EnrollmentFormProps = {
  id?: string;
  enrollmentId?: number;
  noRecordedEnrollments?: boolean;
} & RecordFormProps;

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  id,
  child,
  enrollmentId,
  AdditionalButton,
  afterSaveSuccess,
  setAlerts,
  showFieldOrFieldset = () => true,
  hideErrors,
  noRecordedEnrollments,
}) => {
  if (!child) {
    throw new Error('Enrollment form rendered without child');
  }

  const { errorsHidden } = useValidationErrors(hideErrors);

  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);

  const { user } = useContext(UserContext);
  const sites = user?.sites || [];

  const enrollment =
    (enrollmentId
      ? child.enrollments?.find((e) => e.id === enrollmentId)
      : getCurrentEnrollment(child)) || ({} as Enrollment);

  const createEnrollment = async (updatedData: Enrollment) =>
    await apiPost(
      `children/${child.id}/change-enrollment`,
      { newEnrollment: updatedData },
      { accessToken, jsonParse: false }
    );

  const updateEnrollment = async (updatedData: Enrollment) =>
    await apiPut(`enrollments/${enrollment.id}`, updatedData, {
      accessToken,
    });

  const saveData = enrollment.id ? updateEnrollment : createEnrollment;

  const isMounted = useIsMounted();

  const onFinally = () => {
    if (isMounted()) {
      setLoading(false);
    }
  };
  const onSubmit = (updatedData: Enrollment) => {
    setLoading(true);

    saveData(updatedData)
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save enrollment',
          },
        ]);
      })
      .finally(onFinally);
  };

  return (
    <>
      {!enrollment.id && (
        <Alert
          type="info"
          text="Adding a child who has withdrawn, changed sites or age groups? Add their earliest enrollment then make changes from the child's record in your roster."
        />
      )}
      <Form<Enrollment>
        id={id || `edit-enrollment-form-${enrollment.id}`}
        data={enrollment}
        onSubmit={onSubmit}
        hideStatus={errorsHidden}
      >
        {showFieldOrFieldset(enrollment, ['site']) && (
          <SiteField<Enrollment>
            sites={sites.filter(
              (s) => s.organizationId === child?.organization?.id
            )}
          />
        )}
        {showFieldOrFieldset(enrollment, ['entry']) && (
          <EnrollmentStartDateField<Enrollment> />
        )}
        {showFieldOrFieldset(enrollment, ['exit']) && (
          <>
            <EnrollmentEndDateField<Enrollment> />
            <ExitReasonField<Enrollment> />
          </>
        )}
        {showFieldOrFieldset(enrollment, ['model']) && (
          <CareModelField<Enrollment> />
        )}
        {showFieldOrFieldset(enrollment, ['ageGroup']) && (
          <AgeGroupField<Enrollment> />
        )}
        {(!enrollment?.fundings?.length ||
          showFieldOrFieldset(enrollment, ['fundings'])) && (
          <NewFundingField<Enrollment>
            fundingAccessor={(data) => data.at('fundings').at(0)}
            getEnrollment={(data) => data.value}
            organizationId={child?.organization?.id}
            // Special child-level validation that needs to be displayed on the new funding field
            // but only if hideErrors = false
            missingFundedEnrollmentError={
              errorsHidden
                ? undefined
                : child.validationErrors?.find(
                    (e) => !!e.constraints?.fundedEnrollment
                  )
            }
            hideStatus={errorsHidden}
          />
        )}
        {AdditionalButton}
        <FormSubmitButton
          text={
            loading
              ? 'Saving...'
              : noRecordedEnrollments
              ? 'Add enrollment and funding'
              : 'Save'
          }
          disabled={loading}
        />
      </Form>
    </>
  );
};
