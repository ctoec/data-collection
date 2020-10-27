import React from 'react';
import {
  RecordFormProps,
  doesEnrollmentFormHaveErrors,
  doesFundingFormHaveErrors,
  FundingForm,
  EnrollmentForm,
} from '../../../components/Forms';

/**
 * Special Enrollment / Funding form for batch edit,
 * which chains individual edit forms for all enrollments and fundings
 * with missing or invalid information. As the user completes updating
 * each invdividual funding or enrollment form, they will disappear as
 * this component is re-rendered and the objects themselves no longer
 * have any missing info.
 */
export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  showFieldOrFieldset,
}) => {
  const enrollmentsWithValidationErrors = child?.enrollments?.map(
    (enrollment) => {
      // will return true if enrollment has validation errors,
      // including if any fundings have validation errors
      if (doesEnrollmentFormHaveErrors(child, enrollment.id)) {
        const fundingsWithValidationErrors = enrollment.fundings?.filter(
          (funding) =>
            doesFundingFormHaveErrors(child, enrollment.id, funding.id)
        );
        const enrollmentWithValidationErrors = { ...enrollment };
        enrollmentWithValidationErrors.fundings = fundingsWithValidationErrors;
        return enrollmentWithValidationErrors;
      }
    }
  );

  return (
    <>
      {enrollmentsWithValidationErrors?.map((enrollment) => {
        if (!enrollment) return <> </>;

        const fundingForms = enrollment?.fundings?.map((funding) => (
          <FundingForm
            id={`batch-edit-funding-${funding.id}`}
            fundingId={funding.id}
            enrollmentId={enrollment.id}
            child={child}
            afterSaveSuccess={afterSaveSuccess}
            setAlerts={setAlerts}
            showFieldOrFieldset={showFieldOrFieldset}
            showFundingSource={true}
          />
        ));

        return (
          <>
            {fundingForms}
            {doesEnrollmentFormHaveErrors(child, enrollment.id, {
              excludeFundings: true,
            }) && (
              <EnrollmentForm
                id={`batch-edit-enrollment-${enrollment.id}`}
                enrollmentId={enrollment.id}
                child={child}
                afterSaveSuccess={afterSaveSuccess}
                setAlerts={setAlerts}
                showFieldOrFieldset={showFieldOrFieldset}
              />
            )}
          </>
        );
      })}
    </>
  );
};
