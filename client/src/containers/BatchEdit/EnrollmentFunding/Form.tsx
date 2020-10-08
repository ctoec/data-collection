import React from 'react';
import {
  EditFormProps,
  doesEnrollmentFormHaveErrors,
  doesFundingFormHaveErrors,
  FundingForm,
  EnrollmentForm,
} from '../../../components/Forms';

export const EnrollmentFundingForm: React.FC<EditFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  showField,
}) => {
  const enrollmentsWithValidationErrors = child?.enrollments?.map(
    (enrollment) => {
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
            showField={showField}
          />
        ));

        return (
          <>
            {fundingForms}
            <EnrollmentForm
              id={`batch-edit-enrollment-${enrollment.id}`}
              enrollmentId={enrollment.id}
              child={child}
              afterSaveSuccess={afterSaveSuccess}
              setAlerts={setAlerts}
              showField={showField}
            />
          </>
        );
      })}
    </>
  );
};
